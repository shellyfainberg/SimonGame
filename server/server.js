//Backend server with Express

const express = require("express");
const app = express();
const cors = require("cors");

let isGameOn = false;

app.use(cors());
app.use(express.json());

// app.get("/", (req, res) => {
//   console.log("simons Game");
  
// });

app.post("/", (req, res) => {
  console.log(req.body);
  const { isOn } = req.body;
  isGameOn = isOn;
});

app.listen(5000, () => {
  console.log("server start on port 5000");
});
