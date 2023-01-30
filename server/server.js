//Backend server with Express

const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();

let isGameOn = false;
let currentScore = 0;
let highScore = 0;


const fs = require('fs');

app.use(cors());
app.use(express.json());



app.post('/save', (req, res) => {
    const data = req.body;
    fs.writeFile('data.json', JSON.stringify(data), (err) => {
      if (err) {
        res.send('Error saving data to file.');
      } else {
        res.send('Data saved to file.');
      }
    });
  });

// app.get("/", (req, res) => {
//   console.log("simons Game");

// });

router.post("/status", (req, res) => {

  const { isOn, score } = req.body;
  if (score > highScore) highScore = score;
  isGameOn = isOn;
  currentScore = score;
  const response = { score: score, highScore: highScore, isOn: isOn };
  console.log(response)

  fs.writeFile('status.json', JSON.stringify(response), (err) => {
    if (err) throw err;
    console.log('status data written to file');
  });
  res.send(response);
});

router.get("/status", (req, res) => {
  res.json(isGameOn);
});

router.get("/score", (req, res) => {
  res.json(score);
});

router.get("/highScore", (req, res) => {
    res.json(score);
  });

app.use("/api", router);

app.listen(5000, () => {
  console.log("server start on port 5000");
});
