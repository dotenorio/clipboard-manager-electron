const { app } = require('electron')
const fs = require('fs')
const path = require('path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const dbPath = path.join(app.getPath('userData'), 'copied.json')

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '{}')
}

const adapter = new FileSync(dbPath)
const db = low(adapter)

db.defaults({ copied: [], autoLaunch: true, firstTime: false })
  .write()

module.exports = db
