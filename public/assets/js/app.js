//save an article button
$(document).on("click", "#saveButton", function() {
  const thisId = $(this).data("_id");
  const saved = $(this).data("saved");
  $(this).attr("id", "save");

  const updateSave = {
    saved: saved,
    id: thisId
  };

  console.log(updateSave);

  $.ajax("/article-save/" + thisId, {
    type: "PUT",
    data: updateSave
  }).then(data => {
    console.log(data);
  });

  $(`#${thisId}`).empty();
});

//delete an article and all its notes button
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

  $(`#save`).empty();
});

//delete an individual note button
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

//post a note button
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
    } <a class="deleteNote float-right text-center" id=${data._id}>X</a></li>`;

    $(`#${data._id}`).attr("data-_id", data._id);
    $(".notesBody").append(noteCard);
  });

  $("#noteInput").val("");
});

//button to create a note
let getId;
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
    if (data.note.length < 1) {
      $(".notesBody").text("Notes will show here");
    } else {
      for (let i = 0; i < data.note.length; i++) {
        let noteCard = `<li class="list-group-item" id="id_${
          data.note[i]._id
        }">${
          data.note[i].body
        } <a class="deleteNote  float-right text-center"  id=${
          data.note[i]._id
        }>X</a></li>`;

        $(`#${data.note[i]._id}`).attr("data-_id", data.note[i]._id);
        $(".notesBody").append(noteCard);
      }
    }
  });
});

function appendNote(a) {
  for (let i = 0; i < a.length; i++) {
    let noteCard = `<li class="list-group-item" id="id_${a[i]._id}">${
      a[i].body
    } <a class="deleteNote" id=${a[i]._id}>X</a> </li>`;

    $(`#${a[i]._id}`).attr("data-_id", a[i]._id);
    $(".notesBody").append(noteCard);
  }
}

//sign in form button
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

//login button
$(document).on("click", "#loginSubmit", function() {
  const data = {
    username: $("#usernameInput2").val(),
    password: $("#passwordInput2").val()
  };
  console.log(data);
  $.ajax("/login/", {
    type: "POST",
    data: data
  }).then(data => {
    if(data.signInCheck){
    console.log("sent data");
    document.location.href=`/home/${data._id}`};
  });
});

$(document).on("click", "#signout", function() {
 console.log("test")
  const thisId = $(this).data("id");
  console.log(thisId);
 
  
  $.ajax(`/signout/${thisId}`, {
    type: "GET",
  }).then((data) => {
    console.log("sent data");
    console.log(data);
    if(!data.signInCheck) document.location.href=`/`;
  });
});
