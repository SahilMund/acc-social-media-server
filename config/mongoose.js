const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

// console.log(db);

db.on("error", () => console.log("Error Ocured"));
db.once("open", () => console.log("Connection Established Successfully !!"));
exports.default = db;
