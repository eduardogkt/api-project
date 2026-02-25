import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { dirname } from "path";
import rateLimit from "express-rate-limit";

const app = express();
const port = 3000;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
const apiUrl = "https://byabbe.se/on-this-day/";

app.use(limiter);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
