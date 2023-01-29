//Backend server with Express

const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();

let isGameOn = false;
let currentScore = 0;
let highScore = 0;

app.use(cors());
app.use(express.json());

// app.get("/", (req, res) => {
//   console.log("simons Game");

// });

router.post("/status", (req, res) => {
  const { isOn, score } = req.body;
  if (score > highScore) highScore = score;
  isGameOn = isOn;
  currentScore = score;
  res = { score: score, highScore: highScore, isOn: isOn };
  console.log(res)
});

router.get("/status", (req, res) => {
  res.json(isGameOn);
});

router.get("/score", (req, res) => {
  res.json(score);
});

app.use("/api", router);

app.listen(5000, () => {
  console.log("server start on port 5000");
});
