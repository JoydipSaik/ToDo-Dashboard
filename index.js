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

app.use("/api/auth", userRouter);
app.use("/api/todos", todoRouter);

mongoose
    .connect(process.env.URL)
    .then(() => {
        console.log("MongoDB connected");

        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error.message);
    });