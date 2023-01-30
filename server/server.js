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
  const { isOn, score, steps } = req.body;
  const userId = req.params.userId;
  let userData = {};

  try {
    userData = fs.readFileSync(`${userId}.json`);
    userData = JSON.parse(userData);

  } catch (error) {
    console.log(`User ${userId} data not found. Creating new data...`);
  }

  if (score >= userData.highScore) {
    userData.highScore = score;
  } else {
    userData.highScore = highScore;
  }

  userData.isOn = isOn;
  userData.currentScore = score;
  userData.steps = steps;

  fs.writeFileSync(`${userId}.json`, JSON.stringify(userData));
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
