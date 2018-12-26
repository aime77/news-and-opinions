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

$(document).on("click", ".deleteNote", function() {
  const thisId = $(this).attr("id");

  let deleteObj = {
    id: thisId
  };

  $.ajax("/note/" + thisId, {
    type: "DELETE",
    data: deleteObj
  }).then(data => {
    console.log(data);
  });

  $(`#${thisId}`).remove();
  $(`#id_${thisId}`).remove();
});

$(document).on("click", "#submit", function(event) {
  event.preventDefault();

  const dataObj = {
    note: $("textarea").val()
  };

  $.ajax({
    method: "POST",
    url: "/notes/" + getId,
    data: dataObj
  }).then(data => {
    console.log(data);
    let noteCard = `<li class="list-group-item" id="id_${data._id}">${
      data.body
    } <a class="btn btn-primary small deleteNote" id=${
      data._id
    }>Delete</a></li>`;

    $(".notesBody").append(noteCard);
  });

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
      let noteCard = `<li class="list-group-item" id="id_${data.note[i]._id}">${
        data.note[i].body
      } <a class="btn btn-primary small deleteNote" id=${
        data.note[i]._id
      }>Delete</a></li>`;

      $(".notesBody").append(noteCard);
    }

    //appendNote(data.note)
  });
});

function appendNote(a) {
  for (let i = 0; i < a.length; i++) {
    let noteCard = `<li class="list-group-item" id="id_${a[i]._id}">${
      a[i].body
    } <a class="btn btn-primary small deleteNote" id=${
      a[i]._id
    }>Delete</a></li>`;

    $(".notesBody").append(noteCard);
  }
}

$(document).on("click", "#submitSignin", function(event) {
  event.preventDefault();
  const data = {
    username: $("#inputUsername").val(),
    password: $("#inputPassword").val(),
    email: $("#inputEmail")
      .val()
      .trim(),
    lastName: $("#inputLName").val(),
    firstName: $("#inputName").val()
  };
  console.log(data);
  // empty form validation

  $.ajax("/signin/", {
    type: "POST",
    data: data
  }).then(() => {
    console.log("sent data");
  });

  $("#inputUsername").val("");
  $("#inputPassword").val("");
  $("#inputEmail").val("");
  $("#inputLName").val("");
  $("#inputName").val("");
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
