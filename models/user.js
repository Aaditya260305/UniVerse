const mongoose = require('mongoose')
const { boolean } = require('webidl-conversions')

const user = mongoose.Schema({
    Roll_no : { type : String , required : true} ,
    Password : { type : String } ,
    isadmin : {type : Boolean} 
})

const User = mongoose.model('user', user )
module.exports= User  

