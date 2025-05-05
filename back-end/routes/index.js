const { ModifyRecord, TotalStockingRecord, StockingRecord } = require('../models')
const Router = require('@koa/router')
const router = new Router()

router.post("/all_material_stocking_quantity", async (ctx) => {
  ctx.body = await TotalStockingRecord.getAllRecord()
})

router.post("/search_material", async (ctx) => {
  const keyword = ctx.request.body['keyword']
  const resp = await TotalStockingRecord.searchRecord(keyword)
  ctx.body = {
    materials: resp
  }
})

router.post("/specify_material_stocking_quantity", async (ctx) => {

})

router.post("/stocking_quantity_record", async (ctx) => {

})

router.post("/modify_stocking_quantity", async (ctx) => {
  const data = ctx.request.body
  ModifyRecord.addRow(data)
  ctx.body = {
    data: data
  }
})

module.exports = router