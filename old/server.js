//DEPENDANCIES
//=============================================
require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
// var mongoose = require("mongoose");
// var cheerio = require("cherrio");
// var request = require("request");
var mongojs = require("mongojs");

//INITIALIZE EXPRESS
//=============================================
var app = express();

//DB CONFIG
//=============================================
var db = require("./models");

// var PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});

//=====================================================================
module.exports = app;
