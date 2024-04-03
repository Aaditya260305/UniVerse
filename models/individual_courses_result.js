const mongoose = require("mongoose");

const course_student_result = new mongoose.Schema({
    rollNo: {
        type: String,
        required: true,
        unique: true,
    },
    course:{
        type:String,
        required:true,
    },
    midsem:{
        type:String,
        default:"not known",
    },
    internal:{
        type:String,
        default:"not known",
    },
    endsem:{
        type:String,
        default:"not known",

    },
    gpa:{
        type:String,
        default:"not known",
    }
}
);

const  individual_course_result= mongoose.model("course_student_result", course_student_result);
module.exports = individual_course_result;

