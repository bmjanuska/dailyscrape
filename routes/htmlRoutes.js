var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    Article.find({}, null, { sort: { created: -1 } }, function(err, data) {
      if (data.length === 0) {
        res.render("placeholder", {
          message:
            'There\'s nothing scraped yet. Please click "Scrape For Newest Articles" for fresh and delicious news.'
        });
      } else {
        res.render("index", { articles: data });
      }
    });
  });
};
