const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database("reports.db");

db.run(`
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT,
  score INTEGER,
  burnout TEXT,
  behaviour TEXT,
  focus TEXT,
  suggestion TEXT,
  date TEXT
)
`);

app.post("/save-report", (req, res) => {
  const { type, score, burnout, behaviour, focus, suggestion, date } = req.body;

  db.run(
    `INSERT INTO reports (type, score, burnout, behaviour, focus, suggestion, date)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [type, score, burnout, behaviour, focus, suggestion, date],
    (err) => {
      if (err) return res.status(500).send("Error saving");
      res.send("Saved");
    }
  );
});

app.listen(5000, () => console.log("Backend running on 5000"));