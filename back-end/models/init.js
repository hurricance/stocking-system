const sqlite3 = require('sqlite3')
const path = require('node:path')

const SQLite3 = sqlite3.verbose()
const dbUrl = path.join(__dirname, '../data/record.sqlite')
const db = new SQLite3.Database(dbUrl)

db.on('trace', (sql) => {
  console.log(`Executed SQL: ${sql}`)
})

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
    console.log('Table created: stocking_records');
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
    console.log('Table created: modify_records');
  }
});

db.run(
  `
  CREATE TABLE IF NOT EXISTS total_stocking_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    material_name VARCHAR(255) NOT NULL UNIQUE,
    total_stocking_quantity INTEGER NOT NULL,
    extra VARCHAR(255),
    createdAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
    updatedAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
  )
  `, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Table created: total_stocking_records');
  }
});

module.exports = db