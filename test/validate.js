const assert = require("assert")
const fs = require("fs")
const path = require("path")

const root = path.resolve(__dirname, "..")
const scripts = ["pinokio.js", "install.js", "start.js", "stop.js", "update.js", "install-model.js"]
for (const script of scripts) {
  const value = require(path.join(root, script))
  assert(value && (Array.isArray(value.run) || typeof value.menu === "function"), `${script} must export a Pinokio script`)
}

const metadata = JSON.parse(fs.readFileSync(path.join(root, "pinokio.json"), "utf8"))
assert.strictEqual(metadata.title, "OpenMagia")
assert(fs.existsSync(path.join(root, metadata.icon)), "metadata icon must exist")

const start = fs.readFileSync(path.join(root, "start.js"), "utf8")
assert(start.includes("{{port}}"), "start must use a Pinokio-assigned port")
assert(!start.includes("start.sh"), "Pinokio must own the server instead of the standalone service launcher")

const update = fs.readFileSync(path.join(root, "update.js"), "utf8")
assert(update.includes("git pull --ff-only"), "updates must refuse history-rewriting merges")
assert(!/fs\.rm|reset --hard/.test(update), "updates must preserve user data")

const model = fs.readFileSync(path.join(root, "install-model.js"), "utf8")
assert(model.includes("I ACCEPT"), "model download must require explicit license acceptance")
assert(model.includes("--no-formatter"), "model action must use the resumable OpenMagia installer")

async function validateMenus() {
  const launcher = require(path.join(root, "pinokio.js"))
  const appDir = path.join(root, "app")
  fs.rmSync(appDir, { recursive: true, force: true })
  const info = active => ({
    running: script => script === active,
    local: script => script === "start.js" ? { url: "http://localhost:19000" } : {}
  })
  try {
    let menu = await launcher.menu({}, info(""))
    assert(menu.some(item => item.href === "install.js"), "uninstalled menu must offer Install")
    fs.mkdirSync(appDir, { recursive: true })
    fs.writeFileSync(path.join(appDir, "server.py"), "")
    menu = await launcher.menu({}, info(""))
    assert(menu.some(item => item.href === "start.js"), "installed menu must offer Start")
    assert(menu.some(item => item.href === "update.js"), "installed menu must offer Update")
    menu = await launcher.menu({}, info("start.js"))
    assert(menu.some(item => item.href === "http://localhost:19000"), "running menu must offer Open UI")
    assert(menu.some(item => item.href === "stop.js"), "running menu must offer Stop")
  } finally {
    fs.rmSync(appDir, { recursive: true, force: true })
  }
}

validateMenus().then(() => console.log("OpenMagia Pinokio launcher validation passed"))
