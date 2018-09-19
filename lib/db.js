const { app } = require('electron')
const path = require('path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(path.join(app.getPath('userData'), 'copied.json'))
const db = low(adapter)

db.defaults({ copied: [], autoLaunch: false })
  .write()

module.exports = db
