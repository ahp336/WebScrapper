// Grab the articles as a json
$.getJSON('/articles', function (data) {
    // For each article
    for (let i = 0; i < data.length; i++) {
        // Display the articles on the page
        $('#articles').append(`<div class="card"><div class="card-body"><h5 class="card-title" data-id="${data[i]._id}"><a href=${data[i].link}" target="_blank">${data[i].title}</a></h5><p data-id="${data[i]._id}">${data[i].intro}</p></div></div>`);
    }
});

// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
    //console.log(thisId);
    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // The title of the article
            $("#notes").append("<strong>" + data.title + "</strong>");
            // A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button class='btn btn-primary' data-id='" + data._id + "' id='savenote'>Add Note</button>");

            // If there's a note in the article
            if (data.note) {
                $("#bodyinput").val(data.note.body);
            }
        });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            body: $("#bodyinput").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#bodyinput").val("");
});