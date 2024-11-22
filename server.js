const express = require('express')
const cors = require('cors')
require("dotenv").config();
const session = require('express-session')
const admin = require("./routes/admin")
const partner = require("./routes/partner")
const connectDB = require('./config/db')
connectDB()

const app = express()
const allowedOrigins = ["http://localhost:3000", process.env.LIVE_CLIENT_URL];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))
app.use(express.json())

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'admin_secretstring',
        resave: false,
        saveUninitialized: false,
        cookie: {},
    })
)


app.get("/", (req, res) => {
    res.status(200).send("Server up and running")
})

app.use("/admin", admin)
app.use("/partner", partner)



app.listen(process.env.PORT, () =>
    console.log(`SERVER UP and running at ${process.env.PORT}`))