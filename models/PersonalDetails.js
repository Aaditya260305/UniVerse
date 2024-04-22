const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    rollNo: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    type : {
        type : String , 
        default:"student",
    } 
}
);

const personal_user = mongoose.model("personal_detail", userSchema);
module.exports = personal_user;

