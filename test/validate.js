const assert = require("assert")
const fs = require("fs")
const path = require("path")
const os = require("os")
const vm = require("vm")

const root = path.resolve(__dirname, "..")
const scripts = ["pinokio.js", "install.js", "start.js", "stop.js", "update.js", "install-model.js"]
for (const script of scripts) {
  const value = require(path.join(root, script))
  assert(value && (Array.isArray(value.run) || typeof value.menu === "function"), `${script} must export a Pinokio script`)
}

const metadata = JSON.parse(fs.readFileSync(path.join(root, "pinokio.json"), "utf8"))
assert.strictEqual(metadata.title, "OpenMagia")
assert(fs.existsSync(path.join(root, metadata.icon)), "metadata icon must exist")
const manifest = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"))
assert.strictEqual(manifest.version, "0.3.4", "launcher release metadata must match the current OpenMagia compatibility update")

const launcher = require(path.join(root, "pinokio.js"))
assert.strictEqual(launcher.version, "8.0.0", "launcher must use Pinokio's current script schema")

const install = require(path.join(root, "install.js"))
assert.strictEqual(install.requires && install.requires.bundle, "ai", "AI launcher must request Pinokio's AI bundle")
const installSource = fs.readFileSync(path.join(root, "install.js"), "utf8")
assert(installSource.includes("python -m unittest discover -s tests"), "install must run OpenMagia's regression suite")
assert(installSource.includes("continuity_repair.py"), "install must validate the local continuity repair module")
assert(installSource.includes("yue_prompts.py yue_worker.py yue_generate.py"), "install must validate the complete YuE runtime bridge")

const start = fs.readFileSync(path.join(root, "start.js"), "utf8")
assert(start.includes("{{port}}"), "start must use a Pinokio-assigned port")
assert(!start.includes("start.sh"), "Pinokio must own the server instead of the standalone service launcher")
assert(start.includes('url: "{{input.event[1]}}"'), "start must set the UI URL from the captured regex group")

const update = fs.readFileSync(path.join(root, "update.js"), "utf8")
assert(update.includes("git pull --ff-only"), "updates must refuse history-rewriting merges")
assert(!/fs\.rm|reset --hard/.test(update), "updates must preserve user data")
assert(update.includes("python -m unittest discover -s tests"), "updates must verify the pulled OpenMagia release")
assert(update.includes("continuity_repair.py"), "updates must validate the local continuity repair module")
assert(update.includes("yue_prompts.py yue_worker.py yue_generate.py"), "updates must validate the complete YuE runtime bridge")
assert(update.indexOf('path: "app"') < update.indexOf("python -m unittest discover -s tests"), "application update must complete before its regression suite runs")

const model = fs.readFileSync(path.join(root, "install-model.js"), "utf8")
assert(model.includes("I ACCEPT"), "model download must require explicit license acceptance")
assert(model.includes("--no-formatter"), "model action must use the resumable OpenMagia installer")
assert(model.includes("args.acceptance === 'I ACCEPT'"), "model action must accept an explicit non-interactive license confirmation")

async function validateMenus() {
  // Exercise installation states without touching a user's real app checkout.
  const menuRoot = fs.mkdtempSync(path.join(os.tmpdir(), "openmagia-pinokio-menu-"))
  const isolated = { exports: {} }
  vm.runInNewContext(fs.readFileSync(path.join(root, "pinokio.js"), "utf8"), {
    require, module: isolated, __dirname: menuRoot
  }, { filename: "pinokio.js" })
  const menuLauncher = isolated.exports
  const appDir = path.join(menuRoot, "app")
  const info = active => ({
    running: script => script === active,
    local: script => script === "start.js" ? { url: "http://localhost:19000" } : {}
  })
  try {
    let menu = await menuLauncher.menu({}, info(""))
    assert(menu.some(item => item.href === "install.js"), "uninstalled menu must offer Install")
    fs.mkdirSync(appDir, { recursive: true })
    fs.writeFileSync(path.join(appDir, "server.py"), "")
    menu = await menuLauncher.menu({}, info(""))
    assert(menu.some(item => item.href === "start.js"), "installed menu must offer Start")
    assert(menu.some(item => item.href === "update.js"), "installed menu must offer Update")
    menu = await menuLauncher.menu({}, info("start.js"))
    assert(menu.some(item => item.href === "http://localhost:19000"), "running menu must offer Open UI")
    assert(menu.some(item => item.href === "stop.js"), "running menu must offer Stop")
  } finally {
    fs.rmSync(menuRoot, { recursive: true, force: true })
  }
}

validateMenus().then(() => console.log("OpenMagia Pinokio launcher validation passed"))
