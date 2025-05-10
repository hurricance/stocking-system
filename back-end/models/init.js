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
  CREATE TABLE IF NOT EXISTS modify_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name VARCHAR(255) NOT NULL,
    material_supplier VARCHAR(255) NOT NULL,
    material_name VARCHAR(255) NOT NULL,
    operation_type INTEGER NOT NULL,
    stocking_quantity INTEGER NOT NULL DEFAULT 0,
    batch_time DATE NOT NULL DEFAULT (date(CURRENT_DATE, 'localtime')),
    extra VARCHAR(255) NOT NULL DEFAULT '',
    createdAt DATETIME NOT NULL DEFAULT (date(CURRENT_DATE, 'localtime')),
    updatedAt DATETIME NOT NULL DEFAULT (date(CURRENT_DATE, 'localtime'))
  )
  `, (err) => {
  if (err) {
    console.error('Error creating table: modify_records', err.message);
  } else {
    console.log('Table created: modify_records');

    db.exec(
      `
      CREATE INDEX IF NOT EXISTS idx_modify_records_batch_time ON modify_records (batch_time);
      CREATE INDEX IF NOT EXISTS idx_modify_records_createdAt ON modify_records (createdAt);
      `, (err) => {
      if (err) {
        console.error('Error creating index: modify_records', err.message);
      } else {
        console.log('index created: modify_records');
      }
    });
  }
});

//todo add trigger for updatedAt
db.run(
  `
  CREATE TABLE IF NOT EXISTS daily_batch_stocking_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name VARCHAR(255) NOT NULL,
    material_supplier VARCHAR(255) NOT NULL,
    material_name VARCHAR(255) NOT NULL,
    inbound_stocking_quantity INTEGER NOT NULL DEFAULT 0,
    final_stocking_quantity INTEGER NOT NULL DEFAULT 0,
    consume_stocking_quantity INTEGER NOT NULL DEFAULT 0,
    loss_stocking_quantity INTEGER NOT NULL DEFAULT 0,
    batch_time DATE NOT NULL DEFAULT (date(CURRENT_DATE, 'localtime')),
    extra VARCHAR(255) NOT NULL DEFAULT '',
    createdAt DATETIME NOT NULL DEFAULT (date(CURRENT_DATE, 'localtime')),
    updatedAt DATETIME NOT NULL DEFAULT (date(CURRENT_DATE, 'localtime'))
  )
  `, (err) => {
  if (err) {
    console.error('Error creating table: daily_batch_stocking_records', err.message);
  } else {
    console.log('Table created: daily_batch_stocking_records');

    db.exec(
      `
      CREATE INDEX IF NOT EXISTS idx_daily_records_batch_time ON daily_batch_stocking_records (batch_time);
      CREATE INDEX IF NOT EXISTS idx_daily_records_createdAt ON daily_batch_stocking_records (createdAt);
      CREATE INDEX IF NOT EXISTS idx_daily_records_final_stocking_quantity ON daily_batch_stocking_records (final_stocking_quantity);
      `, (err) => {
      if (err) {
        console.error('Error creating index: daily_batch_stocking_records', err.message);
      } else {
        console.log('index created: daily_batch_stocking_records');
      }
    });
  }
});

db.run(
  `
  CREATE TABLE IF NOT EXISTS total_stocking_quantity_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name VARCHAR(255) NOT NULL,
    material_supplier VARCHAR(255) NOT NULL,
    material_name VARCHAR(255) NOT NULL,
    total_stocking_quantity INTEGER NOT NULL DEFAULT 0,
    total_unsold_quantity INTEGER NOT NULL DEFAULT 0,
    extra VARCHAR(255) NOT NULL DEFAULT '',
    createdAt DATETIME NOT NULL DEFAULT (date(CURRENT_DATE, 'localtime')),
    updatedAt DATETIME NOT NULL DEFAULT (date(CURRENT_DATE, 'localtime')),
    UNIQUE (customer_name, material_supplier, material_name)
  )
  `, (err) => {
  if (err) {
    console.error('Error creating table: total_stocking_quantity_records', err.message);
  } else {
    console.log('Table created: total_stocking_quantity_records');
    db.exec(
      `
      CREATE INDEX IF NOT EXISTS idx_total_records_customer_name ON total_stocking_quantity_records (customer_name);
      CREATE INDEX IF NOT EXISTS idx_total_records_material_supplier ON total_stocking_quantity_records (material_supplier);
      CREATE INDEX IF NOT EXISTS idx_total_records_material_name ON total_stocking_quantity_records (material_name);
      `, (err) => {
      if (err) {
        console.error('Error creating index: total_stocking_quantity_records', err.message);
      } else {
        console.log('index created: total_stocking_quantity_records');
      }
    });
  }
});

module.exports = db