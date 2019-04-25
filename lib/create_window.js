const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  clipboard
} = require('electron')
const path = require('path')
const notifier = require('node-notifier')
const db = require('../lib/db')
const autoLaunch = require('../lib/auto_launch')

let tray = null
let template = []
let contextMenu

function isFirstTime () {
  return db.get('firstTime')
    .value()
}

function displayBalloonFirstTime () {
  if (!isFirstTime()) {
    const content = 'I\'ll stay here if you need me..'
    const message = content
    const icon = path.join(__dirname, '..', 'icons/64x64.png')
    if (process.platform === 'win32') {
      tray.displayBalloon({ title, content, icon })
    } else {
      notifier.notify({ title, message, icon })
    }
    db.set('firstTime', true)
      .write()
  }
}

function createTray () {
  tray = new Tray(path.join(__dirname, '..', 'icons/16x16.png'))
  tray.setToolTip('Click to show your clipboard history')

  template.push({
    label: 'Start with system',
    click: (menuItem) => {
      autoLaunch.toggle()
      menuItem.checked = !!menuItem.checked
    },
    type: 'checkbox',
    checked: autoLaunch.isEnabled()
  })

  template.push({
    label: 'About',
    click: () => {
      win.show()
    }
  })

  template.push({
    label: 'Exit',
    click: () => {
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

  displayBalloonFirstTime()
}

function reloadContextMenu () {
  contextMenu = Menu.buildFromTemplate(template)
  tray.setContextMenu(contextMenu)
}

function persistCopied (currentText) {
  let copied = db.get('copied')
    .push(currentText)
    .write()
  let length = copied.length

  if (length > 10) {
    copied.splice(0, length - 10)
    db.set('copied', copied)
      .write()
  }
}

function addTemplateItem (currentText, checked, persist) {
  if (!currentText) return
  if (template.length === 3) {
    template.unshift({ type: 'separator' })
  }

  checked = checked !== false
  persist = persist !== false
  if (persist) persistCopied(currentText)

  let currentTextTrim = currentText.trim().replace(/\n/g, '\\n')

  template.unshift({
    label: (currentTextTrim.length > 50) ? currentTextTrim.substring(0, 50) + '...' : currentTextTrim,
    click: () => {
      clipboard.writeText(currentText)
    },
    type: 'checkbox',
    checked
  })

  reloadContextMenu()
}

function getCopied () {
  let copied = db.get('copied')
    .take(10)
    .value()
  let length = copied.length

  if (length === 0) {
    addTemplateItem(clipboard.readText())
  } else {
    let i = 0
    copied.forEach((item) => {
      i++
      let checked = (i === length)
      addTemplateItem(item, checked, false)
    })
  }
}

let watcherId = null

function startMonitoringClipboard () {
  let previousText = clipboard.readText()

  const textChanged = () => {
    if (template.length === 14) {
      template.splice(9, 1)
    }

    for (let i = 0; i < 9; i++) {
      if (template[i]) {
        template[i].checked = false
      }
    }

    template[template.length - 3].checked = autoLaunch.isEnabled()

    addTemplateItem(clipboard.readText())
  }

  const isDiffText = (str1, str2) => {
    return str2 && str1 !== str2
  }

  if (!watcherId) {
    watcherId = setInterval(() => {
      if (isDiffText(previousText, previousText = clipboard.readText())) textChanged()
    }, 500)
  }

  getCopied()
}

module.exports = () => {
  var lock = !app.requestSingleInstanceLock()
  if (lock) {
    return app.quit()
  }

  global.win = new BrowserWindow({
    width: 320,
    height: 270,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    closable: true,
    show: false,
    title,
    icon: path.join(__dirname, '..', 'icons/16x16.png'),
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile(path.join(__dirname, '..', 'index.html'))

  win.setMenu(null)

  /* Abrir Painel de desenvolvimento */
  // win.webContents.openDevTools()

  win.on('close', (event) => {
    event.preventDefault()
    win.hide()
  })

  createTray()
  startMonitoringClipboard()
}
