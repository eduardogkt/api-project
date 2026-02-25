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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/search", async (req, res) => {
  const month = req.body.month;
  const day = req.body.day;
  try {
    const result = await axios.get(apiUrl + `${month}/${day}/events.json`);
    res.render("index.ejs", {
      date: result.data.date,
      events: result.data.events,
    });
  } catch (error) {
    console.error(error.message);
    res.render("index.ejs", { error: error });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
