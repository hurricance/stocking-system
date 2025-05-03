const sqlite3 = require('sqlite3')
const path = require('path')

const SQLite3 = sqlite3.verbose()
const dbUrl = path.join(__dirname, '../data/record.sqlite')
const db = new SQLite3.Database(dbUrl)

db.run(
  `
  CREATE TABLE IF NOT EXISTS stocking_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    material_name VARCHAR(255) NOT NULL,
    stocking_quantity INTEGER NOT NULL,
    inbound_time DATE NOT NULL,
    extra VARCHAR(255),
    createdAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
    updatedAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
  )
  `, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Table created.');
  }
});

db.run(
  `
  CREATE TABLE IF NOT EXISTS modify_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    material_name VARCHAR(255) NOT NULL,
    operation_type INTEGER NOT NULL,
    stocking_quantity INTEGER NOT NULL,
    modify_time DATE NOT NULL,
    extra VARCHAR(255),
    createdAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
    updatedAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
  )
  `, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Table created.');
  }
});

module.exports = db