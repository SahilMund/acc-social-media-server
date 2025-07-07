const express = require("express");
require("./config/mongoose");

const app = express();

const PORT = 8888;

app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).send({
    message: `Server is running on PORT - ${PORT}...`,
  });
});

app.use("/api", require("./routes"));

app.listen(PORT, () =>
  console.log(`✌ - Server is running on PORT - ${PORT}...`)
);

/*

find() - to get all the reocords
findByIdAndDelete() -- todelete the record using _id
insertOne-
insertMany-
findOneAndUpdate-
findById
deleteMany 
deleteOne

app.get("/getTodos", async (req, res) => {
  const todos = await Todos.find();
  res.send({
    numOfRecords: todos.length,
    data: todos,
  });
});

app.post("/createTodos", async (req, res) => {
  try {
    const newTodo = await Todos.insertOne({
      title: req.body.title,
    });

    console.log("newTodo", newTodo);
    res.send({
      data: newTodo,
    });
  } catch (error) {
    console.log("error", error.message);
    res.send({
      data: error.message,
    });
  }
});

app.delete("/todos/delete/:id", async (req, res) => {
  console.log("req", req.params);

  try {
    const deletedTodo = await Todos.findByIdAndDelete(req.params.id);
    console.log("deletedTodo", deletedTodo);
    res.send({
      data: deletedTodo,
    });
  } catch (error) {
    console.log("error", error.message);
    res.send({
      data: error.message,
    });
  }
});


*/
