const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title should be a required field"],
      unique: [true, "Title should be a unique field"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Todos = model("Todos", todoSchema);
module.exports = Todos;
