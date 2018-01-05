global.win = null
global.title = 'Clipboard Manager Electron'

const {app} = require('electron')
const isInExecution = require('./lib/is_in_execution')
const createWindow = require('./lib/create_window')

require('./lib/events')()

if (isInExecution()) {
  app.exit()
}

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
