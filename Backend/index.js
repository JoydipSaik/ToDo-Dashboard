const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

const mongoose = require("mongoose");
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const userRouter = require("./routes/user.routes");
const todoRouter = require("./routes/todo.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "ToDo Dashboard Backend is running"
    });
});

app.use("/api/auth", userRouter);
app.use("/api/todos", todoRouter);

mongoose
    .connect(process.env.URL)
    .then(() => {
        console.log("MongoDB connected");

        const PORT = process.env.PORT || 10000;

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error.message);
        process.exit(1);
    });