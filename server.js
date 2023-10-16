const express = require("express");
const budget = require("./newMod.json");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());

const mongoose = require("mongoose");
app.use("/", express.static("public"));
const budgetModel = require("./models/budgetschema");

let url = "mongodb://127.0.0.1:27017/personalbudget";

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

app.get("/budget", (req, res) => {
  mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("connected to database");
      budgetModel
        .find({})
        .then((data) => {
          res.send(data);
          mongoose.connection.close();
        })
        .catch((connectionError) => {
          console.log(connectionError);
        });
    })
    .catch((connectionError) => {
      console.log(connectionError);
    });
});

app.post("/postMyBudgetData", (req, res) => {
  mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connecting to database for insertion");
      let newData = new budgetModel(req.body);
      budgetModel
        .insertMany(newData)
        .then((data) => {
          res.send("Data Inserted successfully into the DataBase");
          mongoose.connection.close();
        })
        .catch((connectionError) => {
          console.log("1", connectionError);
          res.send(connectionError.message);
        });
    })
    .catch((connectionError) => {
      console.log("2", connectionError);
      res.send(connectionError);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
