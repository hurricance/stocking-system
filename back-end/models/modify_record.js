const db = require('./init')
const dailyBatchStockingRecord = require('./daily_batch_stocking_record')
const totalStockingQuantityRecord = require('./total_stocking_quantity_record')
const moment = require('moment')

class ModifyRecord {
  constructor() {
    this.db = db
    this.tableName = "modify_records"
  }

  /**
   * @param {Object} operationData 
   * @param {string} operationData.customer_name
   * @param {string} operationData.material_supplier
   * @param {string} operationData.material_name
   * @param {string} [operationData.batch_time]
   * @param {number} operationData.operation_type
   * @param {string} operationData.quantity
   * @param {string} operationData.extra
   */
  addRow(operationData) {
    const db = this.db
    let batch_time
    if (operationData.batch_time !== undefined) {
      batch_time = moment(operationData.batch_time, 'YYYY-MM-DD').format('YYYY-MM-DD')
    } else {
      batch_time = moment().format('YYYY-MM-DD')
    }
    operationData.batch_time = batch_time
    dailyBatchStockingRecord.modifyRecord(operationData)
    totalStockingQuantityRecord.modifyRecord(operationData)

    db.run(
      `
      INSERT INTO ${this.tableName} (customer_name, material_supplier, material_name, operation_type, quantity, batch_time, extra)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [operationData.customer_name, operationData.material_supplier, operationData.material_name, operationData.operation_type, operationData.quantity, operationData.batch_time, operationData.extra],
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