const cheerio = require("cheerio");
const axios = require("axios");

// Require all models
const db = require("./models");

app.get("/scrape", function (req, res) {
    axios.get("https://www.bostonglobe.com/").then(function (response) {
        const $ = cheerio.load(response.data);
        $("").each(function(i,element){
            let result = {};

            result.title = $(this)
            .children("a")
            .text();
            result.link = $(this)
            .children("a")
            .attr("href");

            db.Article.create(result)
            .then(function(dbArticle){
                console.log(dbArticle)
            })
            .catch(function(err){
                return res.json(err);
            });
        });

        res.send("Scrape Complete");

    });
});