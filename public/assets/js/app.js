$(function(){

$(".change-devoured").on("click", function (event){
  let id = $(this).data("id");
  let newStatus = $(this).data("cashed");
  console.log(newStatus);

  let newDev = {
   cashed: newStatus
  };

  $.ajax("/api/customer/bills/" + id, {
    type: "PUT",
    data: newDev
  }).then(
    () =>{
      console.log("changed devoured to", newDev);
      location.reload();
    }
  );
});

  $(".create-form").on("submit", function (event) {
    event.preventDefault();
    var test=$("#eNew").val().trim();
  
    // let regex = /^[a-zA-Z\s]+$/;
    // if ($(`#eNew`).val().trim() === ""|| !regex.test($("#eNew").val())) {
    //   $("#modalPopUp").text("You have to enter a valid name before submitting!");
    //   return true;
    // }
  
    let objInfo = {
      email: $("#eNew").val().trim(),
      quantity:$('#qNew').val().trim(),
      burger_name:$('#bNew').val().trim()
    };
    console.log('test');
    $.ajax("/api/customer", {
      type: "POST",
      data: objInfo
    }).then(()=> {
      console.log("created new burger");
      location.reload();
    }
    );

    $("#eNew").val("");
     $('#qNew').val("");
      $('#bNew').val("");
});
})