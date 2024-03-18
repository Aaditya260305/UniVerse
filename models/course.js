const mongoose = require('mongoose')

const course = mongoose.Schema({
    title : { type : String , required : true} ,
    description : { type : String } ,
    semester : {type : String , required : true},
    department : {type : String , required : true},
    notes : [String],
    links : [String],
    pyq : [String]
})

const Course = mongoose.model('course', course )
module.exports= Course  

