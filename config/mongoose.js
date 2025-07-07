const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://sahil:abc@cluster0.cy5ihkf.mongodb.net/InstaClone";

mongoose.connect(MONGODB_URI);

const db = mongoose.connection;

// console.log(db);

db.on("error", () => console.log("Error Ocured"));
db.once("open", () => console.log("Connection Established Successfully !!"));
exports.default = db;
