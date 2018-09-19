const { app, ipcMain } = require('electron')

module.exports = () => {
  ipcMain.on('get-version', (event) => {
    event.returnValue = app.getVersion()
  })
}
