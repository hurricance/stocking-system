const { modifyRecord, totalStockingQuantityRecord, dailyBatchStockingRecord } = require('../models')
const Router = require('@koa/router')
const router = new Router()

// all total quantity
router.post("/all_quantity_data", async (ctx) => {
  const data = await totalStockingQuantityRecord.getAllRecord()
  ctx.body = {
    data: data
  } 
})

// specify material in total quantity
router.post("/quantity_data", async (ctx) => {
  const queryBody = ctx.request.body
  const resp = await totalStockingQuantityRecord.searchRecord(queryBody)
  ctx.body = {
    data: resp
  }
})

// curd for quantity
router.post("/operation", async (ctx) => {
  const operationData = ctx.request.body
  operationData.extra = operationData.extra ?? ''
  modifyRecord.addRow(operationData)
  ctx.body = {
    message: "success"
  }
})

// search details in modifyrecord by kinds and date
router.post("/details", async (ctx) => {
  const queryBody = ctx.request.body
  const data = await dailyBatchStockingRecord.queryDetail(queryBody)
  ctx.body = {
    data: data
  }
})

module.exports = router