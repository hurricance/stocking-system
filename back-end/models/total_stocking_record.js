const db = require('./init')
const moment = require('moment')
const modifyTableName = "modify_records"

class TotalStockingRecord {
  constructor() {
    this.db = db
    this.tableName = "total_stocking_records"
  }

  async getAllRecord() {
    let resp = await new Promise((resolve, reject) => {
      db.all(
        `
          SELECT * FROM ${this.tableName}
        `,
        [],
        (err, rows) => {
          if (err) {
            console.log("fail to get data");
          } else {
            if (rows === undefined) {
            } else {
              resolve(rows)
            }
          }
        }
      )
    }) 
    return resp
  }

  async searchRecord(keyword) {
    let resp = await new Promise((resolve, reject) => {
      db.all(
        `
          SELECT material_name, total_stocking_quantity
          FROM ${this.tableName}
          WHERE material_name LIKE ?
        `,
        [`%${keyword}%`],
        (err, rows) => {
          if (err) {
            console.log(err)
          } else {
            if (rows === undefined) {
            } else {
              resolve(rows)
            }
          }
        }
      )
    }) 
    return resp
  }

  async searchRecordWithHistory(material_name) {
    const firstDayOfMonth = moment().startOf('month').format('YYYY-MM-DD')
    const currentDate = moment().format('YYYY-MM-DD')

    let resp = await new Promise((resolve, reject) => {
      db.all(
        `
          SELECT 
          a.material_name as material_name, 
          a.total_stocking_quantity as total_stocking_quantity,
          b.operation_type as operation_type,
          b.stocking_quantity as modified_quantity,
          b.modify_time as modify_time,
          b.createdAt as createdAt
          FROM (
            SELECT * FROM ${this.tableName}
            WHERE material_name = ? 
          ) as a
          LEFT JOIN ${modifyTableName} as b ON a.material_name = b.material_name
          WHERE b.modify_time BETWEEN ? and ?
          ORDER BY b.modify_time ASC
        `,
        [material_name, firstDayOfMonth, currentDate],
        (err, rows) => {
          if (err) {
            console.log(err)
          } else {
            if (rows === undefined) {
            } else {
              resolve(rows)
            }
          }
        }
      )
    }) 
    return resp
  }

  async modifyRecord(data) {
    db.get(
      `
        SELECT * FROM ${this.tableName}
        WHERE material_name = ?
      `,
      [data.material_name],
      (err, row) => {
        if (err) {
          console.log("fail to get data");
        } else {
          if (row === undefined) {
            this.addRow(data)
          } else {
            this.modifyQuantity(data, row.total_stocking_quantity)
          }
        }
      }
    )
  }

  async addRow(data) {
    data.quantity = data.operation_type === 2 ? -data.quantity : data.quantity
    db.run(
      `
        INSERT INTO ${this.tableName} (material_name, total_stocking_quantity)
        VALUES (?, ?)
      `, [data.material_name, data.quantity],
      (err) => {
        if (err) {
          console.error('fail to update')
        } else {
          console.log("success to update");
        }
      }
    )
  }

  async modifyQuantity(data, originalQuantity) {
    data.quantity = data.operation_type === 2 ? originalQuantity - data.quantity: data.quantity + originalQuantity
    db.run(
      `
        UPDATE ${this.tableName}
        SET total_stocking_quantity = ?
        WHERE material_name = ?
      `, [data.quantity, data.material_name],
      (err) => {
        if (err) {
          console.error('fail to update, 123')
          console.log(err)
        } else {
          console.log("success to update");
        }
      }
    )
  }
}

module.exports = new TotalStockingRecord()