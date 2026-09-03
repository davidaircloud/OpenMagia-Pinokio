module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        message: "git clone --depth 1 https://github.com/davidaircloud/OpenMagia.git app"
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
        html: "<b>OpenMagia Editor is installed.</b><br>Start it now, or install the optional generation model separately after reviewing its license."
      }
    }
  ]
}
