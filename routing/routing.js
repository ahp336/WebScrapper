// Our scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  // A GET route for scraping the Rolling Stones website
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.rollingstone.com/politics/").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $("header.c-card__header").each(function (i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children('h3')
          .text();
        result.intro = $(this)
          .children('p')
          .text();
        result.link = $(this)
          .parent('a')
          .attr('href');
        console.log(result);

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // console logging any error
            console.log(err);
          });
      });

      // Send a message to the client
      res.send("Scrape Complete");
    });
  });

  // Route for getting all Articles from the db
  app.get("/articles", function (req, res) {

    db.Article.find({})
      .then(dbArticle => res.json(dbArticle))
      .catch(err => { throw err })
  });

  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id }).populate("note")
      .then(dbArticle => res.json(dbArticle))
      .catch(err => { throw err });
  });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function (req, res) {

    db.Note.create(req.body)
      .then(dbNote => {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(dbArticle => res.json(dbArticle))
      .catch(err => { throw err });
  })
};