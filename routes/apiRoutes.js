// var db = require("../models");
// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configurationa
var databaseUrl = "spoontamago";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var mdb = mongojs(databaseUrl, collections);

module.exports = function(app) {
  mdb.on("error", function(error) {
    console.log("Database Error:", error);
  });

  // Main route (simple Hello World Message)
  app.get("/", function(req, res) {
    res.send("Hello world");
  });

  // Retrieve data from the mdb
  app.get("/all", function(req, res) {
    // Find all results from the scrapedData collection in the mdb
    mdb.scrapedData.find({}, function(error, found) {
      // Throw any errors to the console
      if (error) {
        console.log(error);
      }
      // If there are no errors, send the data to the browser as json
      else {
        res.json(found);
      }
    });
  });

  // Scrape data from one site and place it into the mongomdb mdb
  app.get("/scrape", function(req, res) {
    // Make a request for the news section of `ycombinator`
    request("http://www.spoon-tamago.com/", function(error, response, html) {
      // Load the html body from request into cheerio
      var $ = cheerio.load(html);
      // For each element with a "title" class
      $("div.post-header").each(function(i, element) {
        // Save the text and href of each link enclosed in the current element

        var postTitle = $(element).children("h2.post-title");
        var postMeta = $(element).children("div.post-meta");

        var title = postTitle.text();
        var link = postTitle.children("a").attr("href");
        var date = postMeta.children("span.post-date").text();
        var author = postMeta.children("span.post-author").text();
        // If this found element had both a title and a link
        if (title && link) {
          // Insert the data in the scrapedData mdb
          mdb.scrapedData.insert(
            {
              title: title,
              link: link,
              date: date,
              author: author
            },
            function(err, inserted) {
              if (err) {
                // Log the error if one is encountered during the query
                console.log(err);
              } else {
                // Otherwise, log the inserted data
                console.log(inserted);
              }
            }
          );
        }
      });
    });

    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
  });
};
