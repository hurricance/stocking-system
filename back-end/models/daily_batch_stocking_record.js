const moment = require('moment')
const db = require('./init')
const operationType = require('./operation_type')
const totalRecordName = 'total_stocking_quantity_records'

class DailyBatchStockingRecord {
  constructor() {
    this.db = db
    this.tableName = "daily_batch_stocking_records"
  }

  /**
   * 
   * @param {Object} queryBody
   * @param {string} queryBody.customer_name
   * @param {string} queryBody.material_supplier
   * @param {string} queryBody.material_name
   * @param {string} [queryBody.modify_time]
   */
  async queryDetail(queryBody) {
    let totalData = await new Promise((resolve, reject) => {
      this.db.get(
        `
          SELECT *
          FROM ${totalRecordName}
          WHERE customer_name = ? and material_supplier = ? and material_name = ?
        `,
        [queryBody.customer_name, queryBody.material_supplier, queryBody.material_name],
        (err, row) => {
          if (err) {
            console.log(err)
          } else {
            if (row === undefined) {
            } else {
              resolve(row)
            }
          }
        }
      )
    })

    const monthStartDate = moment().startOf('month').format('YYYY-MM-DD')
    const curDate = moment().format('YYYY-MM-DD')
    if (queryBody.modify_time !== undefined) {
      const specifyDate = queryBody.modify_time
      let qtyGap
      if (specifyDate === curDate) {
        qtyGap = 0
      } else {
        qtyGap = await new Promise((resolve, reject) => {
          this.db.get(
            `
              SELECT SUM(remain_stocking_quantity)
              FROM ${this.tableName}
              WHERE batch_time > ? and batch_time <= ? and customer_name = ? and material_supplier = ? and material_name = ?
            `,
            [specifyDate, curDate, queryBody.customer_name, queryBody.material_supplier, queryBody.material_name],
            (err, row) => {
              if (err) {
                console.log(err)
              } else {
                if (row === undefined) {
                } else {
                  resolve(row)
                }
              }
            }
          )
        })
      }

      const totalRemainQtyOfSpe = totalData.total_stocking_quantity - qtyGap
      let data = await new Promise((resolve, reject) => {
        this.db.get(
          `
          SELECT *
          FROM ${this.tableName}
          WHERE batch_time = ? and customer_name = ? and material_supplier = ? and material_name = ?
        `,
          [specifyDate, queryBody.customer_name, queryBody.material_supplier, queryBody.material_name],
          (err, row) => {
            if (err) {
              console.log(err)
            } else {
              if (row === undefined) {
              } else {
                resolve(row)
              }
            }
          }
        )
      })
      data.curQty = totalRemainQtyOfSpe
      data.totalQty = totalRemainQtyOfSpe
      return [data]
    } else {
      let data = await new Promise((resolve, reject) => {
        this.db.all(
          `
          SELECT *
          FROM ${this.tableName}
          WHERE batch_time BETWEEN ? and ? and customer_name = ? and material_supplier = ? and material_name = ?
        `,
          [monthStartDate, curDate, queryBody.customer_name, queryBody.material_supplier, queryBody.material_name],
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
      let gapQty = 0
      for(let i = data.length - 1; i >= 0; i--) {
        data[i].curQty = totalData.total_stocking_quantity - gapQty
        data[i].totalQty = totalData.total_stocking_quantity
        gapQty += data[i].remain_stocking_quantity
      }
      return data
    }
  }

  /**
   * @param {Object} operationData 
   * @param {string} operationData.customer_name
   * @param {string} operationData.material_supplier
   * @param {string} operationData.material_name
   * @param {string} operationData.batch_time
   * @param {number} operationData.operation_type
   * @param {string} operationData.quantity
   * @param {string} operationData.extra
   */
  modifyRecord(operationData) {
    db.get(
      `
        SELECT *
        FROM ${this.tableName}
        WHERE customer_name = ? and material_supplier = ? and material_name = ? and batch_time = ?
      `,
      [operationData.customer_name, operationData.material_supplier, operationData.material_name, operationData.batch_time],
      (err, row) => {
        if (err) {
          console.log("fail to get data", err);
        } else {
          if (row === undefined) {
            this.judegeOperationType(operationData, operationType.addRow)
          } else {
            this.judegeOperationType(operationData, operationData.operation_type, row)
          }
        }
      }
    )
  }

  /**
   * @param {Object} operationData 
   * @param {string} operationData.customer_name
   * @param {string} operationData.material_supplier
   * @param {string} operationData.material_name
   * @param {string} operationData.batch_time
   * @param {number} operationData.operation_type
   * @param {string} operationData.quantity
   * @param {string} operationData.extra
   */
  addRow(operationData) {
    const db = this.db
    if (operationData.operation_type !== operationType.addQuantity) {
      return
    }
    db.run(
      `
        INSERT INTO ${this.tableName}
        (customer_name, material_supplier, material_name, inbound_stocking_quantity, remain_stocking_quantity, batch_time, extra)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [operationData.customer_name, operationData.material_supplier, operationData.material_name, operationData.quantity, operationData.quantity, operationData.batch_time, operationData.extra],
      (err) => {
        if (err) {
          console.error('fail to update')
        } else {
          console.log("success to update");
        }
      }
    )
  }

  /**
   * @param {Object} operationData 
   * @param {string} operationData.customer_name
   * @param {string} operationData.material_supplier
   * @param {string} operationData.material_name
   * @param {string} operationData.batch_time
   * @param {number} operationData.operation_type
   * @param {string} operationData.quantity
   * @param {string} operationData.extra
   * 
   * @param {Object} rowData
   * @param {number} rowData.inbound_stocking_quantity
   * @param {number} rowData.remain_stocking_quantity
   */
  addQuantity(operationData, rowData) {
    const db = this.db
    const newInboundStockingQuantity = operationData.quantity + rowData.inbound_stocking_quantity
    const newRemainStockingQuantity = operationData.quantity + rowData.remain_stocking_quantity
    db.run(
      `
        UPDATE ${this.tableName}
        SET inbound_stocking_quantity = ?, remain_stocking_quantity = ?, updatedAt = ?
        WHERE customer_name = ? and material_supplier = ? and material_name = ? and batch_time = ? 
      `,
      [newInboundStockingQuantity, newRemainStockingQuantity, moment().format("YYYY-MM-DD HH:mm:ss"), operationData.customer_name, operationData.material_supplier, operationData.material_name, operationData.batch_time],
      (err) => {
        if (err) {
          console.log("fail to update stocking records", err);
        } else {
          console.log("success to update stocking records");
        }
      }
    )
  }

  /**
   * @param {Object} operationData 
   * @param {string} operationData.customer_name
   * @param {string} operationData.material_supplier
   * @param {string} operationData.material_name
   * @param {string} operationData.batch_time
   * @param {number} operationData.operation_type
   * @param {string} operationData.quantity
   * @param {string} operationData.extra
   * 
   * @param {Object} rowData
   * @param {number} rowData.remain_stocking_quantity
   * @param {number} rowData.consume_quantity
   */
  consumeQuantity(operationData, rowData) {
    const db = this.db
    const newRemainStockingQuantity = rowData.remain_stocking_quantity - operationData.quantity
    const newConsumeQuantity = rowData.consume_quantity + operationData.quantity
    db.run(
      `
        UPDATE ${this.tableName}
        SET remain_stocking_quantity = ?, consume_quantity = ?, updatedAt = ?
        WHERE customer_name = ? and material_supplier = ? and material_name = ? and batch_time = ? 
      `,
      [newRemainStockingQuantity, newConsumeQuantity, moment().format("YYYY-MM-DD HH:mm:ss"), operationData.customer_name, operationData.material_supplier, operationData.material_name, operationData.batch_time],
      (err) => {
        if (err) {
          console.log("fail to update stocking records");
        } else {
          console.log("success to update stocking records");
        }
      }
    )
  }

  /**
   * @param {Object} operationData 
   * @param {string} operationData.customer_name
   * @param {string} operationData.material_supplier
   * @param {string} operationData.material_name
   * @param {string} operationData.batch_time
   * @param {number} operationData.operation_type
   * @param {string} operationData.quantity
   * @param {string} operationData.extra
   * 
   * @param {Object} rowData
   * @param {number} rowData.remain_stocking_quantity
   * @param {number} rowData.forSale_quantity
   */
  forSaleQuantity(operationData, rowData) {
    const db = this.db
    const newRemainStockingQuantity = rowData.remain_stocking_quantity - operationData.quantity
    const newForSaleQuantity = rowData.forSale_quantity + operationData.quantity
    db.run(
      `
        UPDATE ${this.tableName}
        SET remain_stocking_quantity = ?, forSale_quantity = ?, updatedAt = ?
        WHERE customer_name = ? and material_supplier = ? and material_name = ? and batch_time = ? 
      `,
      [newRemainStockingQuantity, newForSaleQuantity, moment().format("YYYY-MM-DD HH:mm:ss"), operationData.customer_name, operationData.material_supplier, operationData.material_name, operationData.batch_time],
      (err) => {
        if (err) {
          console.log("fail to update stocking records");
        } else {
          console.log("success to update stocking records");
        }
      }
    )
  }

  /**
   * @param {Object} operationData 
   * @param {number} opt 
   * @param {Object} rowData 
   */
  judegeOperationType(operationData, opt, rowData) {
    switch (opt) {
      case operationType.addRow:
        this.addRow(operationData)
        break
      case operationType.addQuantity:
        this.addQuantity(operationData, rowData)
        break
      case operationType.consumeQuantity:
        this.consumeQuantity(operationData, rowData)
        break
      case operationType.forSaleQuantity:
        this.forSaleQuantity(operationData, rowData)
        break
    }
  }
}

module.exports = new DailyBatchStockingRecord()