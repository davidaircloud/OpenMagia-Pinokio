module.exports = {
  run: [
    {
      method: "script.stop",
      params: {
        uri: "start.js"
      }
    },
    {
      method: "shell.run",
      params: {
        message: "git pull --ff-only"
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        message: "git pull --ff-only"
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        message: "python -m compileall -q server.py nle.py h3_prompts.py openmagia_plugins.py"
      }
    },
    {
      method: "notify",
      params: {
        html: "<b>OpenMagia is up to date.</b><br>Projects, media, models, and settings were preserved."
      }
    }
  ]
}
