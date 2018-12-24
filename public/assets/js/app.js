$(document).on("click", "#saveButton", function(){
const thisId=$(this).data("_id");
const saved=$(this).data("saved");

console.log(saved);
console.log(thisId);

let updateSave={
    saved:saved,
    id:thisId
};

$.ajax("/article-save/"+thisId,{
    type:"PUT",
    data:updateSave
})
.then((data)=>{
console.log(data);

})
$(`#${thisId}`).empty();
})

$(document).on("click", "#deleteButton", function(){
    const thisId=$(this).data("_id");
    
    console.log(thisId);
    
    let deleteObj={
        id:thisId
    };
    
    $.ajax("/article-delete/"+thisId,{
        type:"DELETE",
        data:deleteObj
    })
    .then((data)=>{
    console.log(data);
    })

    $(`#${thisId}`).empty();
    })

    $(document).on("click", "#submit", function(){
        
        const thisId=$(this).data("_id");
        
        $.ajax({
            method:"POST",
            url:`/note/${thisId}`,
            data:{
            note:$("#noteText").val().trim(),
        }
        })
        .then((data)=>{
        console.log(data);
        })
    
        $("#note").val("");
        })