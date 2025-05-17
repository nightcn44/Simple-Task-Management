const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { readdirSync } = require("fs");
const helmet = require("helmet");
const connectDB = require("./config/db");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());

readdirSync("./routes").forEach((file) => {
  if (file.endsWith(".js")) {
    try {
      console.log(`Loading route: ${file}`);
      app.use("/api", require("./routes/" + file));
    } catch (err) {
      console.error(`Error loading route ${file}:`, err);
    }
  }
});

app.use((err, req, res, next) => {
  console.error("Unexpected error:", err);
  res.status(500).json({ message: "Something went wrong" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
