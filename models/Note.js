const monggose=require("monggose");

const Schema=mongoose.Schema;

const NoteSchema=new Schema({

    title:String,
    body: {
        type:String,
    }
});

const Note=mongoose.model("Note", NoteSchema);

module.exports=Note;