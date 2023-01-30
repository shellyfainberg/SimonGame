//Backend server with Express

const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();

let isGameOn = false;
let currentScore = 0;
let highScore = 0;

const fs = require("fs");

app.use(cors());
app.use(express.json());

router.post("/status/:userId", (req, res) => {
  const {score, steps } = req.body;
  const userId = req.params.userId;
  let userData = [];

  try {
    let data = fs.readFileSync(`${userId}.json`);
    userData = JSON.parse(data);
  } catch (error) {
    console.log(`User ${userId} data not found. Creating new data...`);
  }

  let newData = {
    score,
    steps,
  };

// find the maximum value
userData.push(newData);
const highScore = Math.max(...userData.map(score => score.score));
const updatedScores = userData.map(data => {
    return { ...data, highScore };
  });


  fs.writeFileSync(`${userId}.json`, JSON.stringify(updatedScores), (err) => {
    if (err) throw err;
    console.log(`Status data for user ${userId} appended to file`);
  });
  res.send(userData);
});

router.get("/status/:userId", (req, res) => {
  const userId = req.params.userId;

    fs.readFile(`${userId}.json`, (err, data) => {
      if (err) throw err;
      res.json(JSON.parse(data));
    });
});

app.use("/api", router);

app.listen(5000, () => {
  console.log("server start on port 5000");
});
