const Koa = require('koa')
const { bodyParser } = require("@koa/bodyparser");
const app = new Koa()
const router = require('./routes')

app.use(bodyParser())
app.use(router.routes())

app.listen(3000)
