const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require('path');

// listen on port 3000
const PORT = process.env.PORT || 3000;
// Initialize Express
const app = express();
// Use morgan logger for logger requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
// Make public a static folder
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname + './public')));
app.use(bodyParser.urlencoded({ extended:true}));

app.use(bodyParser.json());

app.engine("handlebars", exphbs({ defaultLayout: "main"}))
app.set("view engine", "handlebars");
// Connect to Mongo db  
mongoose.connect("mongodb://root:root@192.168.99.100/webScrapeHw?authSource=admin", { useNewUrlParser: true});


// Require all models
const db = require("./models");
// Import Routes/Controller
var router = require('./routes/apiRoutes.js');
app.use(router);

// app.get("/scrape", function (req, res) {
//     request("https://www.nytimes.com/section/technology",function (response) {
//         const $ = cheerio.load(response.data);
//         $("li").each(function(i,element){
//             let result = {};

//             result.title = $(this)
//             .children("a")
//             .text();
//             result.link = $(this)
//             .children("a")
//             .attr("href");

//             db.Article.create(result)
//             .then(function(dbArticle){
//                 console.log(dbArticle)
//             })
//             .catch(function(err){
//                 return res.json(err);
//             });
//         });
//         res.send("Scrape Complete");
//     });
// });

app.listen(PORT,()=>{
    console.log("App running on port" + PORT + "!");
})
