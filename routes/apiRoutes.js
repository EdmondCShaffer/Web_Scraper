const cheerio = require("cheerio");
const request = require("request");
var express = require('express');
var router = express.Router();
var notes = require('../models/Note.js')
var articles = require('../models/Article.js')

// Require all models
const db = require("../models");

router.get("/scrape", function (req, res) {
    //console.log("in scrape")
    request('https://www.theverge.com/tech', function(error, response, html) {

        // Then, load html into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);
    
        // This is an error handler for the Onion website only, they have duplicate articles for some reason...
        var titlesArray = [];
    
        // Now, grab every everything with a class of "inner" with each "article" tag
        $("h2.c-entry-box--compact__title").each(function(i, element) {
            // Create an empty result object
            var result = {};
    
          //   result.title = $(this).children("a").text();
          // result.link = $(this).children().children("a").attr("href");
    
          result.title = $(this).text();
          console.log(result.title);
        result.link = $(this) .children("a") .attr("href");
        console.log(result.link);

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle)
                })
                .catch(function (err) {
                    return res.json(err);
                });
        });
        res.send("Scrape Complete");
    });
});
router.get("/", (req, res) => {
    db.Article.find({}).then(grabFromDb => {
        console.log(grabFromDb,"grab articals from db");

        const hbrObj = { articles: grabFromDb };
        res.render('index', hbrObj);
    }).catch(err => res.json(err));
});


router.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            console.log(dbArticle);
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});



router.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
})

router.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.render("/index");
        });
});
router.get('/saved', (req, res) => {
    db.Article.find({ saved: true })
       
});



module.exports = router;
