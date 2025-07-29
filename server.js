const express = require("express");
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");
const Post = require("./models/post.model");
const cookieParser = require("cookie-parser");

dotenv.config();

require("./config/mongoose");

const app = express();

const PORT = 8888;

if (process.env.NODE_ENV === "production") {
  console.log = () => {};
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 1day
    },
  })
);

// const allowedOrigins = ["http://localhost:5173"]; //add your local host FE url, deployed FE URL

app.use(
  cors({
    origin: (origin, cb) => {
      cb(null, origin);
      // if (!origin || allowedOrigins.includes(origin)) {
      //   cb(null, true);
      // } else {
      //   cb(new Error("NOT allowed by CORS"));
      // }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

//CRON SCHEDULAR -- 9AM every monday
// cron.schedule("* * * * *", async () => {
//   console.log("[CRON JOB] - schedular checking for the posts");
//   const nowUTC = new Date();
//   const offset = 5.5 * 60 * 60 * 1000; //5:30hr
//   const nowIST = new Date(nowUTC.getTime() + offset);

//   const foundPosts = await Post.find({
//     isScheduled: true,
//     scheduledTime: { $lte: nowIST },
//   });

//   for (let post of foundPosts) {
//     post.isScheduled = false;
//     await post.save();
//     console.log("[CRON JOB] - scheduled post - " + post._id);
//   }
// });

app.get("/", (req, res) => {
  res.status(200).send({
    message: `Server is running on PORT - ${PORT}...`,
  });
});

app.use("/api", require("./routes"));

app.listen(PORT, () =>
  console.log(`✌ - Server is running on PORT - ${PORT}...`)
);

module.exports = app;

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
