module.exports = {
  run: [
    {
      method: "script.stop",
      params: {
        uri: "start.js"
      }
    },
    {
      method: "notify",
      params: {
        html: "OpenMagia has stopped. Projects, media, models, and settings are preserved."
      }
    }
  ]
}
