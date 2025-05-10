const Koa = require('koa')
const { bodyParser } = require("@koa/bodyparser");
const cors = require('@koa/cors')
const app = new Koa()
const router = require('./routes')

app.use(cors())
app.use(bodyParser())
app.use(router.routes())

app.listen(3000)
