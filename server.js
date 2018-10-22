const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// listen on port 3000
const PORT = 3000;
// Initialize Express
const app = express();
// Use morgan logger for logger requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to Mongo db  
mongoose.connect("mongodb://root:root@192.168.99.100/webScrapeHw?authSource=admin", { useNewUrlParser: true});

app.listen(PORT,()=>{
    console.log("App running on port" + PORT + "!");
})
