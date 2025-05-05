const moment = require('moment')
const db = require('./init')

const operationType = {
  addRow: 0,
  addQuantity: 1,
  reduceQuantity: 2,
  returnQuantity: 3,
}

class StockingRecord {
  constructor() {
    this.db = db
    this.tableName = "stocking_records"
  }

  getRecord(data) {
    db.all()
  }

  modifyRecord(data) {
    db.get(
      `
        SELECT * FROM stocking_records
        WHERE material_name = ? and inbound_time = ?
      `,
      [data.material_name, data.modify_time],
      (err, row) => {
        if (err) {
          console.log("fail to get data");
        } else {
          if (row === undefined) {
            this.judegeOperationType(data, operationType.addRow, 0)
          } else {
            this.judegeOperationType(data, data.operation_type, row.stocking_quantity)
          }
        }
      }
    )
  }

  addRow(data) {
    const db = this.db
    if (data.operation_type !== operationType.addQuantity && data.operation_type !== operationType.reduceQuantity && data.operation_type !== operationType.returnQuantity ) {
      return
    }
    if(data.operation_type === operationType.reduceQuantity) {
      data.quantity = -data.quantity
    }
    db.run(
      `
        INSERT INTO ${this.tableName} (material_name, stocking_quantity, inbound_time, extra)
        VALUES (?, ?, ?, ?)
      `, [data.material_name, data.quantity, data.modify_time, data.extra],
      (err) => {
        if (err) {
          console.error('fail to update')
        } else {
          console.log("success to update");
        }
      }
    )
  }

  addQuantity(data, originalQuantity) {
    const db = this.db
    const totalQuantity = data.quantity + originalQuantity
    db.run(
      `
        UPDATE ${this.tableName}
        SET stocking_quantity = ?, updatedAt = ?
        WHERE material_name = ? and inbound_time = ? 
      `,
      [totalQuantity, moment().format("YYYY-MM-DD HH:mm:ss"), data.material_name, data.modify_time],
      (err) => {
        if (err) {
          console.log("fail to update stocking records");
        } else {
          console.log("success to update stocking records");
        }
      }
    )
  }

  reduceQuantity(data, originalQuantity) {
    const db = this.db
    const totalQuantity = originalQuantity - data.quantity
    db.run(
      `
        UPDATE ${this.tableName}
        SET stocking_quantity = ?, updatedAt = ?
        WHERE material_name = ? and inbound_time = ? 
      `,
      [totalQuantity, moment().format("YYYY-MM-DD HH:mm:ss"), data.material_name, data.modify_time],
      (err) => {
        if (err) {
          console.log("fail to update stocking records");
        } else {
          console.log("success to update stocking records");
        }
      }
    )
  }

  returnQuantity(data, originalQuantity) {
    const db = this.db
    const totalQuantity = originalQuantity + data.quantity
    db.run(
      `
        UPDATE ${this.tableName}
        SET stocking_quantity = ?, updatedAt = ?
        WHERE material_name = ? and inbound_time = ? 
      `,
      [totalQuantity, moment().format("YYYY-MM-DD HH:mm:ss"), data.material_name, data.modify_time],
      (err) => {
        if (err) {
          console.log("fail to update stocking records");
        } else {
          console.log("success to update stocking records");
        }
      }
    )
  }

  judegeOperationType(data, opt, originalQuantity) {
    switch (opt) {
      case operationType.addRow:
        this.addRow(data)
        break
      case operationType.addQuantity:
        this.addQuantity(data, originalQuantity)
        break
      case operationType.reduceQuantity:
        this.reduceQuantity(data, originalQuantity)
        break
      case operationType.returnQuantity:
        this.returnQuantity(data, originalQuantity)
        break
    }
  }
}

module.exports = new StockingRecord()