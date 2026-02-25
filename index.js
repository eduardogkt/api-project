import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";

const app = express();
const port = 3000;
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
const apiUrl = "https://byabbe.se/on-this-day/";

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(limiter);
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/search", async (req, res) => {
    const month = req.body.month;
    const day = req.body.day;
    const type = req.body.type;
    const sort = req.body.sort;
    try {
        const result = await axios.get(apiUrl + `${month}/${day}/${type}.json`);
        const eventsRaw = result.data[`${type}`];
        const events = sort === "newest" ? eventsRaw.reverse() : eventsRaw;

        res.render("index.ejs", {
            date: result.data.date,
            events: events,
            filters: { type, sort },
        });
    } catch (error) {
        console.error("Erro ao buscar eventos:", error.message);

        res.status(500).render("index.ejs", {
            date: null,
            events: [],
            filters: { type, sort },
            error: "Não foi possível carregar os eventos.",
        });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});
