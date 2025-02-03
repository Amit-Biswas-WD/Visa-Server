const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.POST || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Visa Server is Running.");
});

app.listen(port, () => {
  console.log(`Visa Server port is ${port}`);
});

app.listen(port, () => {
  console.log(`Visa Server port is ${port}`);
});
