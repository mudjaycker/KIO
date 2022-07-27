require("dotenv").config()

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const kioRoutes = require("./routes/kio");
const bodyParser = require('body-parser');
const PORT = 3000

mongoose.connect(process.env.DATABASE_URL);
db = mongoose.connection
db.on("error", (error)=> console.error(error))
db.once("open", ()=> console.log("db connected"))


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", kioRoutes);
app.listen(PORT, () => console.log(`server is running in http://localhost:${PORT}`));