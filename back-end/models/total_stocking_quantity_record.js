const db = require('./init')
const moment = require('moment')
const operationType = require('./operation_type')

const modifyTableName = "modify_records"

class TotalStockingQuantityRecord {
  constructor() {
    this.db = db
    this.tableName = "total_stocking_quantity_records"
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

  /**
   * @param {Object} queryBody 
   * @param {string} queryBody.customer_name
   * @param {string} queryBody.material_supplier
   * @param {string} queryBody.material_name
   */
  async searchRecord(queryBody) {
    let resp = await new Promise((resolve, reject) => {
      db.all(
        `
          SELECT *
          FROM ${this.tableName}
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
    return resp
  }

  // async searchRecordWithHistory(material_name) {
  //   const firstDayOfMonth = moment().startOf('month').format('YYYY-MM-DD')
  //   const currentDate = moment().format('YYYY-MM-DD')

  //   let resp = await new Promise((resolve, reject) => {
  //     db.all(
  //       `
  //         SELECT 
  //         a.material_name as material_name, 
  //         a.total_stocking_quantity as total_stocking_quantity,
  //         b.operation_type as operation_type,
  //         b.stocking_quantity as modified_quantity,
  //         b.modify_time as modify_time,
  //         b.createdAt as createdAt
  //         FROM (
  //           SELECT * FROM ${this.tableName}
  //           WHERE material_name = ? 
  //         ) as a
  //         LEFT JOIN ${modifyTableName} as b ON a.material_name = b.material_name
  //         WHERE b.modify_time BETWEEN ? and ?
  //         ORDER BY b.modify_time ASC
  //       `,
  //       [material_name, firstDayOfMonth, currentDate],
  //       (err, rows) => {
  //         if (err) {
  //           console.log(err)
  //         } else {
  //           if (rows === undefined) {
  //           } else {
  //             resolve(rows)
  //           }
  //         }
  //       }
  //     )
  //   }) 
  //   return resp
  // }

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
  async modifyRecord(operationData) {
    db.get(
      `
        SELECT * FROM ${this.tableName}
        WHERE customer_name = ? and material_supplier = ? and material_name = ?
      `,
      [operationData.customer_name, operationData.material_supplier, operationData.material_name],
      (err, row) => {
        if (err) {
          console.log("fail to get data");
        } else {
          if (row === undefined) {
            this.addRow(operationData)
          } else {
            this.modifyQuantity(operationData, row)
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
   * @param {string} [operationData.batch_time]
   * @param {number} operationData.operation_type
   * @param {string} operationData.quantity
   * @param {string} operationData.extra
   */
  async addRow(operationData) {
    if (operationData.operation_type !== operationType.addQuantity) {
      return
    }
    db.run(
      `
        INSERT INTO ${this.tableName}
        (customer_name, material_supplier, material_name, total_stocking_quantity)
        VALUES (?, ?, ?, ?)
      `, [operationData.customer_name, operationData.material_supplier, operationData.material_name, operationData.quantity],
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
   * @param {string} [operationData.batch_time]
   * @param {number} operationData.operation_type
   * @param {string} operationData.quantity
   * @param {string} operationData.extra
   * 
   * @param {Object} rowData
   * @param {number} rowData.total_stocking_quantity
   * @param {number} rowData.total_forSale_quantity
   */
  async modifyQuantity(operationData, rowData) {
    let newTotalRemainQuantity = rowData.total_stocking_quantity, newTotalForSaleQuantity = rowData.total_forSale_quantity
    switch(operationData.operation_type) {
      case operationType.addQuantity:
        newTotalRemainQuantity += operationData.quantity
        break
      case operationType.consumeQuantity:
        newTotalRemainQuantity -= operationData.quantity
        break
      case operationType.forSaleQuantity:
        newTotalRemainQuantity -= operationData.quantity
        newTotalForSaleQuantity += operationData.quantity
        break
    }
    db.run(
      `
        UPDATE ${this.tableName}
        SET total_stocking_quantity = ?, total_forSale_quantity = ?, updatedAt = ?
        WHERE customer_name = ? and material_supplier = ? and material_name = ?
      `, [newTotalRemainQuantity, newTotalForSaleQuantity, moment().format("YYYY-MM-DD HH:mm:ss"), operationData.customer_name, operationData.material_supplier, operationData.material_name],
      (err) => {
        if (err) {
          console.error('fail to update')
          console.log(err)
        } else {
          console.log("success to update");
        }
      }
    )
  }
}

module.exports = new TotalStockingQuantityRecord()