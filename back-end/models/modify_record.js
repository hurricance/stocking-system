const db = require('./init')
const StockingRecord = require('./stocking_record')
const TotalStockingRecord = require('./total_stocking_record')
const moment = require('moment')

class ModifyRecord {
  constructor() {
    this.db = db
    this.tableName = "modify_records"
  }

  addRow(data) {
    const db = this.db
    const modify_time = moment(data.modify_time).format('YYYY-MM-DD')
    data.modify_time = modify_time
    StockingRecord.modifyRecord(data)
    TotalStockingRecord.modifyRecord(data)

    db.run(
      `
      INSERT INTO ${this.tableName} (material_name, operation_type, stocking_quantity, modify_time, extra)
      VALUES (?, ?, ?, ?, ?)
      `,
      [data.material_name, data.operation_type, data.quantity, data.modify_time, data.extra],
      (err) => {
        if (err) {
          console.error('fail to update')
        } else {
          console.log("success to update");
        }
      }
    )
  }
}

module.exports = new ModifyRecord()