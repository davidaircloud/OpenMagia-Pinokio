const fs = require("fs")
const os = require("os")
const path = require("path")

const here = __dirname
const exists = relative => fs.existsSync(path.join(here, relative))

module.exports = {
  version: "8.0.0",
  title: "OpenMagia",
  icon: "icon.svg",
  description: "Local-first AI video editor. Native generation is currently supported only on Apple Silicon Macs with at least 64 GB RAM.",
  menu: async (kernel, info) => {
    const installed = exists("app/server.py")
    const modelInstalled = exists("app/models/MiniMax-H3/FL2VA/transformer/config.json") && exists("app/models/MiniMax-H3/Ref2VA/transformer/config.json")
    const platform = (kernel && kernel.platform) || os.platform()
    const arch = (kernel && kernel.arch) || os.arch()
    const generationSupported = platform === "darwin" && arch === "arm64" && os.totalmem() >= 64 * 1024 ** 3
    const running = {
      install: info.running("install.js"),
      start: info.running("start.js"),
      model: info.running("install-model.js"),
      update: info.running("update.js")
    }

    if (running.install) return [{ default: true, icon: "fa-solid fa-plug fa-spin", text: "Installing editor", href: "install.js" }]
    if (running.model) return [{ default: true, icon: "fa-solid fa-download fa-spin", text: "Downloading generation model", href: "install-model.js" }]
    if (running.update) return [{ default: true, icon: "fa-solid fa-rotate fa-spin", text: "Updating", href: "update.js" }]
    if (!installed) return [{ default: true, icon: "fa-solid fa-plug", text: "Install Editor", href: "install.js", params: { fullscreen: true, run: true } }]

    if (running.start) {
      const local = info.local("start.js")
      const menu = []
      if (local && local.url) menu.push({ default: true, icon: "fa-solid fa-arrow-up-right-from-square", text: "Open UI", href: local.url })
      menu.push({ icon: "fa-solid fa-terminal", text: "Server Log", href: "start.js" })
      menu.push({ icon: "fa-solid fa-stop", text: "Stop", href: "stop.js", params: { fullscreen: true, run: true } })
      return menu
    }

    const menu = [
      { default: true, icon: "fa-solid fa-power-off", text: "Start", href: "start.js", params: { fullscreen: true, run: true } },
      { icon: "fa-solid fa-rotate", text: "Update", href: "update.js", params: { fullscreen: true, run: true } }
    ]
    if (modelInstalled) {
      menu.push({ icon: "fa-solid fa-circle-check", text: "Generation model installed" })
    } else if (generationSupported) {
      menu.push({ icon: "fa-solid fa-download", text: "Install Generation Model (~278 GB)", href: "install-model.js", params: { fullscreen: true, run: true } })
    } else {
      menu.push({ icon: "fa-solid fa-circle-info", text: "Editor ready · Generation requires Apple Silicon and 64 GB RAM" })
    }
    menu.push({ icon: "fa-solid fa-scale-balanced", text: "Review MiniMax H3 License", href: "https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE", popout: true })
    return menu
  }
}
