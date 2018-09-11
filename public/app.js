// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  console.log(data[0]);
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p>" + data[i].title + "<br />" + data[i].date + "</p>");
    //Need to make a save article button
    $("#articles").append("<a class='btn btn-primary addNote' data-id='" + data[i]._id + "'>" + "Make A Note" + "</a>");

    $("#articles").append("<a class='btn btn-primary saveArticle' data-id='" + data[i]._id + "'>" + "Save Article" + "</a>");
    //Create another button to save the article. dataid or something to then get it to show in a saved page
    //will have to handle in backend to true/ false so it moves
    // not here... when saved articles then need a route that will get the saved articles db.saved /
  }
});


// Whenever someone clicks a button tag
$(document).on("click", ".addNote", function() {
  console.log("click");
  // Empty the notes from the note section ????
  $("#notes").empty();
  // Save the id from the button tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      // if (data.note) {
      //   // Place the title of the note in the title input
      //   $("#titleinput").val(data.note.title);
      //   // Place the body of the note in the body textarea
      //   $("#bodyinput").val(data.note.body);
      // }
      $.get("/notes/" + thisId, function(data) {
        console.log(data);
        $(data).each(function(i, element) {
          var container = $("<div>");
          var title = $("<p>").text(element.title);
          var body = $("<p>").text(element.body);
          //create the delete button
          //going to have to pass in the notes id to the btn element._id

          container.append(title);
          container.append(body);
          $("#notes").append(container);
        })
      })
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log("data-id " + thisId);
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val(),
      article: thisId
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      // $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


// TODO ================================================

//When you click it will save the article
$(document).on("click", ".saveArticle", function() {
  console.log("save clicked!");
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "UPDATE",
    url: "/articles/" + thisId,
  });
});

//When you click the scrape new article scrapeBtn
$(document).on("click", "#scrapeBtn", function() {
  // Grab the id associated with the article from the submit button
});

//When you click it will remove all articles from the DB
$(document).on("click", "#removeBtn", function() {
  // Grab the id associated with the article from the submit button
});

//This needs to have a link that takes the user to the article
// $("#articles").append("<button>" + "Read the Article" + "</button>");
// $("#articles").append("<button data-id=''>" + "Make A Note" + "</button>");
