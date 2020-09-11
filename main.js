global.win = null
global.title = 'Clipboard Manager Electron'

const { app, dialog } = require('electron')
const createWindow = require('./lib/create_window')

require('./lib/events')()

app.on('second-instance', () => {
  dialog.showMessageBox({
    type: 'info',
    title,
    message: 'An instance of ' + title + ' already open',
    buttons: ['Ok']
  })
})

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
