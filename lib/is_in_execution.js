const {app, dialog} = require('electron')

module.exports = () => {
  return app.makeSingleInstance((commandLine, workingDirectory) => {
    dialog.showMessageBox({
      type: 'info',
      title,
      message: 'An instance of ' + title + ' already open'
    })
  })
}
