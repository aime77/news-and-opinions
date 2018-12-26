$(document).on("click", "#saveButton", function() {
  const thisId = $(this).data("_id");
  const saved = $(this).data("saved");

  console.log(saved);
  console.log(thisId);

  let updateSave = {
    saved: saved,
    id: thisId
  };

  $.ajax("/article-save/" + thisId, {
    type: "PUT",
    data: updateSave
  }).then(data => {
    console.log(data);
  });
  $(`#${thisId}`).empty();
});

$(document).on("click", "#deleteButton", function() {
  const thisId = $(this).data("_id");

  let deleteObj = {
    id: thisId
  };

  $.ajax("/article-delete/" + thisId, {
    type: "DELETE",
    data: deleteObj
  }).then(data => {
    console.log(data);
  });

  $(`#${thisId}`).empty();
});

$(document).on("click", "#submit", function(event) {
  event.preventDefault();
  const id = $(this).data("_id");
  console.log(id);

  const dataObj = {
    note: $("textarea").val()
  };

  $.ajax({
    method: "POST",
    url: "/notes/" + getId,
    data: dataObj
  }).then(() => {});

  $("#noteInput").val("");
});

var getId;
$(document).on("click", "#noteButton", function() {
  $("#notesTitle").empty();
  const thisId = $(this).data("_id");
  $(".notesBody").empty();

  $.ajax({
    method: "GET",
    url: `/notes/${thisId}`
  }).then(function(data) {
    $("#notesTitle").append(data.title);
    getId = data._id;
    
    for (let i = 0; i < data.note.length; i++) {
      $(".notesBody").append(`<li class="list-group-item">${data.note[i].body} <a class="btn btn-primary small" id="deleteButton">Delete</a></li>`);
      $(".deleteButton").attr("data-_id", data.note[i]._id);
    }
  });
});



$(document).on("click", "#submitSignin", function(event) {
    event.preventDefault();
  const data = {
    username: $("#inputUsername")
      .val(),
    password: $("#inputPassword")
      .val(),
    email: $("#inputEmail")
      .val()
      .trim(),
    lastName: $("#inputLName")
      .val(),
    firstName: $("#inputName")
      .val(),
  };
  console.log(data);
  // empty form validation
 
    $.ajax("/signin/", {
      type: "POST",
      data: data
    }).then(() => {
      console.log("sent data");
    });

    $("#inputUsername")
      .val("");
    $("#inputPassword")
      .val("");
   $("#inputEmail")
      .val("");
    $("#inputLName")
      .val("");
    $("#inputName")
      .val("");
    
  });


$(document).on("click", "#login", function() {
 
  const data = {
    username: $("#inputUsername")
      .val()
      .trim(),
    password: $("#inputPassword") 
      .val()
      .trim()
  };
  $.ajax("/login", {
    type: "POST",
    data: data
  }).then(() => {
    console.log("sent data");
  });
});
