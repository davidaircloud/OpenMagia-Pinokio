module.exports = {
  run: [
    {
      when: "{{platform !== 'darwin' || arch !== 'arm64' || os.totalmem() < 68719476736}}",
      method: "notify",
      params: {
        html: "<b>Native generation is not supported on this machine.</b><br>The editor works cross-platform, but the current H3 backend requires an Apple Silicon Mac with at least 64 GB RAM."
      },
      next: null
    },
    {
      method: "input",
      params: {
        title: "Accept MiniMax H3 License",
        description: "This optional download is approximately 278 GB. Review https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE, then type I ACCEPT to confirm that you accept the MiniMax H3 Community License.",
        type: "modal",
        form: [{
          key: "acceptance",
          title: "License acceptance",
          placeholder: "I ACCEPT"
        }]
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        env: {
          OPENMAGIA_LICENSE_ACCEPTANCE: "{{input.acceptance}}"
        },
        message: [
          "set -euo pipefail",
          "[ \"$OPENMAGIA_LICENSE_ACCEPTANCE\" = \"I ACCEPT\" ] || { echo 'License was not accepted; model download cancelled.' >&2; exit 7; }",
          "bash install.sh --no-formatter"
        ]
      }
    },
    {
      method: "notify",
      params: {
        html: "<b>MiniMax H3 installation complete.</b><br>Interrupted downloads are resumable by running this action again."
      }
    }
  ]
}
