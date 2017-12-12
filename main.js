const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  dialog,
  ipcMain
} = require('electron')
const fs = require('fs')
const path = require('path')
const url = require('url')
const clipboard = require('electron-clipboard-extended')

let win
let tray = null
let template = []
let contextMenu
let title = 'Clipboard Manager Electron'
let lockFile = 'clipboard-manager-electron.lock'

ipcMain.on('get-version', (event) => {
  event.returnValue = app.getVersion()
})

function isInExecution (callback) {
  fs.stat(lockFile, (err, data) => {
    if (err || !data) {
      fs.writeFile(lockFile, '', () => {
        callback(false)
      })
    } else {
      dialog.showMessageBox({
        type: 'info',
        title,
        message: 'An instance of ' + title + ' already open'
      })
      callback(true)
    }
  })
}

function createTray () {
  tray = new Tray(path.join(__dirname, 'icons/16x16.png'))
  tray.setToolTip('Click to show your clipboard history')

  template.push({
    label: 'About',
    click () {
      win.show()
    }
  })

  template.push({
    label: 'Exit',
    click () {
      fs.unlink(lockFile, () => {})
      app.exit()
    }
  })
  reloadContextMenu()

  tray.on('double-click', () => {
    tray.popUpContextMenu(contextMenu)
  })

  tray.on('click', () => {
    tray.popUpContextMenu(contextMenu)
  })

  tray.displayBalloon({
    title,
    content: 'I\'ll stay here if you need me..',
    icon: path.join(__dirname, 'icons/64x64.png')
  })
}

function reloadContextMenu () {
  contextMenu = Menu.buildFromTemplate(template)
  tray.setContextMenu(contextMenu)
}

function addTemplateItem (currentText) {
  if (!currentText) return
  if (template.length === 2) {
    template.unshift({type: 'separator'})
  }

  template.unshift({
    label: (currentText.length > 50) ? currentText.substring(0, 50) + '...' : currentText,
    click () {
      clipboard.writeText(currentText)
    },
    type: 'checkbox',
    checked: true
  })

  reloadContextMenu()
}

function startMonitoringClipboard () {
  clipboard.on('text-changed', () => {
    if (template.length === 13) {
      template.splice(9, 1)
    }

    template = template.map((item) => {
      item.checked = false
      return item
    })

    addTemplateItem(clipboard.readText())
  }).startWatching()

  addTemplateItem(clipboard.readText())
}

function createWindow () {
  win = new BrowserWindow({
    width: 320,
    height: 270,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    closable: true,
    show: false,
    title,
    icon: path.join(__dirname, 'icons/16x16.png')
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.setMenu(null)

  /* Abrir Painel de desenvolvimento */
  // win.webContents.openDevTools()

  win.on('close', (event) => {
    event.preventDefault()
    win.hide()
  })

  isInExecution((status) => {
    if (status) return app.exit(0)
    createTray()
    startMonitoringClipboard()
  })
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
