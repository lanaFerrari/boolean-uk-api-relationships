require("dotenv").config()

const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const db = require("./utils/database");

/* IMPORT ROUTERS */

const userRouter = require("./resources/user/router");
const addressRouter = require("./resources/address/router");
const orderRouter = require("./resources/order/router");

const app = express()

/* SETUP MIDDLEWARE */

app.disable("x-powered-by")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))

/* SETUP ROUTES */

app.use("/user", userRouter);
app.use("/address", addressRouter);
app.use("/order", orderRouter);

app.get("*", (req, res) => {
  res.json({ ok: true })
})

/* START SERVER */

const port = process.env.PORT || 3030

app.listen(port, () => {
  console.log(`\n🚀 Server is running on http://localhost:${port}/\n`)
})