const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  clipboard,
  dialog
} = require('electron')
const path = require('path')
const notifier = require('node-notifier')
const db = require('./db')
const autoLaunch = require('./auto_launch')

let tray = null
let contextMenu
let defaultMenusSize

const copiedLimit = 10
const template = []

function isFirstTime () {
  return !db.get('firstTime')
    .value()
}

function getCopiedQty () {
  return db.get('copiedQty')
    .value()
}

function displayBalloonFirstTime () {
  if (isFirstTime()) {
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

    autoLaunch.toggle()
  }
}

function dialogClearHistory () {
  return dialog.showMessageBox({
    title: 'Clear clipboard history',
    type: 'question',
    message: 'Do you really want to clear your clipboard history? This action cannot be reversed!',
    buttons: ['Yes, clear', 'No, thanks']
  }).then(clickedButton => {
    if (clickedButton.response !== 0) return

    const copiedLength = db.get('copied')
      .value().length

    db.set('copied', [])
      .write()

    template.splice(0, copiedLength)

    reloadSubmenuCopied()
    getCopied()
  })
}

function createTray () {
  const copiedQty = getCopiedQty()
  tray = new Tray(path.join(__dirname, '..', 'icons/16x16.png'))
  tray.setToolTip('Click to show your clipboard history')

  template.unshift({
    label: '',
    type: 'submenu',
    submenu: Menu.buildFromTemplate([]),
    id: 'subCopied',
    visible: false
  })

  template.push({
    label: `Clipboard history limit (${copiedQty} clips)`,
    type: 'submenu',
    submenu: Menu.buildFromTemplate(submenuHistoryLimitTemplate()),
    id: 'submenuHistoryLimit'
  })

  template.push({
    label: 'Clear clipboard history',
    click: dialogClearHistory
  })

  template.push({
    type: 'separator'
  })

  template.push({
    label: 'Start with system',
    click: (menuItem) => {
      autoLaunch.toggle()
      menuItem.checked = !menuItem.checked
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

  if (!defaultMenusSize) {
    defaultMenusSize = template.length
  }

  reloadContextMenu()

  tray.on('double-click', () => {
    tray.popUpContextMenu(contextMenu)
  })

  tray.on('click', () => {
    tray.popUpContextMenu(contextMenu)
  })

  displayBalloonFirstTime()
}

function reloadSubmenuCopied () {
  const index = template.findIndex(item => item.id === 'subCopied')
  if (index > -1) {
    template[index].visible = false
  }
}

function reloadSubmenuHistorylimit () {
  const copiedQty = getCopiedQty()
  const index = template.findIndex(item => item.id === 'submenuHistoryLimit')
  if (index > -1) {
    template[index].submenu = Menu.buildFromTemplate(submenuHistoryLimitTemplate())
    template[index].label = `Clipboard history limit (${copiedQty} clips)`
  }
}

function submenuHistoryLimitTemplate () {
  const copiedQty = getCopiedQty()
  const limits = [10, 25, 50, 75, 100]

  return limits.map(limit => {
    const checked = limit === copiedQty
    return {
      label: `${limit} clips`,
      click: () => {
        db.set('copiedQty', limit)
          .write()
        const newCopiedQty = getCopiedQty()
        const copied = db.get('copied')
          .value()
        const copiedLength = copied.length

        if (copiedLength > newCopiedQty) {
          const newCopiedLength = copiedLength - newCopiedQty
          copied.splice(0, newCopiedLength)
          template.splice(0, newCopiedLength)
          db.set('copied', copied)
            .write()
        }

        reloadSubmenuCopied()
        reloadSubmenuHistorylimit()
        reloadContextMenu()
      },
      type: 'radio',
      checked: checked
    }
  })
}

function reloadContextMenu () {
  contextMenu = Menu.buildFromTemplate(template)
  tray.setContextMenu(contextMenu)
}

function persistCopied (currentText) {
  const copiedQty = getCopiedQty()
  const copied = db.get('copied')
    .push(currentText)
    .write()
  const length = copied.length

  if (length > copiedLimit) getSubCopied()

  if (length > copiedQty) {
    copied.splice(0, length - copiedQty)
    db.set('copied', copied)
      .write()
  }
}

function truncateCurrentText (currentText) {
  const currentTextTrim = currentText.trim().replace(/\n/g, '\\n')
  const length = 50

  return (currentTextTrim.length > length) ? currentTextTrim.substring(0, length) + '...' : currentTextTrim
}

function addTemplateItem (currentText, checked, persist) {
  if (!currentText) return
  if (template.length === defaultMenusSize) {
    template.unshift({ type: 'separator' })
  }

  checked = checked !== false
  persist = persist !== false
  if (persist) persistCopied(currentText)

  template.unshift({
    label: truncateCurrentText(currentText),
    click: () => {
      clipboard.writeText(currentText)
    },
    type: 'radio',
    checked
  })

  reloadContextMenu()
}

function getCopiedFromDb () {
  const copiedQty = getCopiedQty()
  const copied = db.get('copied')
    .take(copiedQty)
    .value()
  const length = copied.length

  return { copied, length }
}

function getSubCopied () {
  const { copied, length } = getCopiedFromDb()
  const size = length - copiedLimit
  const subCopied = copied.splice(0, size)
  copied.slice(size)

  if (subCopied.length === 0) return { copied, length: copied.length }

  const subCopiedTemplate = subCopied.map(currentText => {
    return {
      label: truncateCurrentText(currentText),
      click: () => {
        clipboard.writeText(currentText)
      }
    }
  }).reverse()

  const index = template.findIndex(item => item.id === 'subCopied')
  const setLabel = (length) => {
    const subCopiedPlural = subCopied.length === 1 ? 'clip' : 'clips'
    return `More ${length} ${subCopiedPlural}...`
  }
  if (index > -1) {
    template[index].submenu = Menu.buildFromTemplate(subCopiedTemplate)
    template[index].label = setLabel(subCopied.length)
    template[index].visible = true
  }

  reloadContextMenu()

  return { copied, length: copied.length }
}

function getCopied () {
  let { copied, length } = getCopiedFromDb()

  if (length > copiedLimit) {
    const getSubCopiedRes = getSubCopied()
    copied = getSubCopiedRes.copied
    length = getSubCopiedRes.length
  }

  if (length === 0) {
    addTemplateItem(clipboard.readText())
  } else {
    copied.forEach((item, i) => {
      const checked = (i + 1 === length)
      addTemplateItem(item, checked, false)
    })
  }
}

let watcherId = null

function startMonitoringClipboard () {
  let previousText = clipboard.readText()

  const textChanged = () => {
    const sizeToDoSplice = copiedLimit + defaultMenusSize
    const sizeToStartSplice = copiedLimit - 1

    if (template.length > sizeToDoSplice) {
      template.splice(sizeToStartSplice, 1)
    }

    for (let i = 0; i < sizeToStartSplice; i++) {
      if (template[i]) {
        template[i].checked = false
      }
    }

    template[template.length - defaultMenusSize].checked = autoLaunch.isEnabled()

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
