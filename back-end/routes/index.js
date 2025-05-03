const { ModifyRecord } = require('../models')
const Router = require('@koa/router')
const router = new Router()

router.post("/all_material_stocking_quantity", async (ctx) => {
  ctx.body = "this is a post method"
})

router.post("/specify_material_stocking_quantity", async (ctx) => {

})

router.post("/stocking_quantity_record", async (ctx) => {

})

router.post("/modify_stocking_quantity", async (ctx) => {
  const data = ctx.request.body
  ModifyRecord.addRow(data)
  ctx.body = {
    "data": data
  }
})

module.exports = router