const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: "First name is required"
  },
  lastName: {
    type: String,
    trim: true,
    required: "Last name is required"
  },
  username: {
    type: String,
    trim: true,
    required: "Username is required"
  },
  password: {
    type: String,
    trim: true,
    required: "Password is required",
    validate: [
      function(input) {
        return input.length >= 7;
      },
      "Password must be at least 7 characters long."
    ]
  },
  article: [{
    type: Schema.Types.ObjectId,
    ref: "Article"
  }],
  email: {
    type: String,
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid e-mail address"]
  },

  userCreated:{
      type:Date,
      default:Date.now
  },
  lastUpdated:Date,
  fullName:String,
  article: {
    type: Schema.Types.ObjectId,
    ref: "Article"
  }

});

UserSchema.methods.lastUpdatedDate=()=>{
    this.lastUpdated=Date.now();
    return this.lastUpdated;
};

UserSchema.methods.setFullName=()=>{
    this.fullName=`${this.firstName} ${this.lastName}`;
    return this.fullName;
}

const User=mongoose.model("User", UserSchema);

module.exports=User;
