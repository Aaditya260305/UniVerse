const express = require('express')
const cookieParser = require("cookie-parser");

const router = express.Router()

router.use(cookieParser());

// importing fucntion of removing session id
const {remove_uuid} = require('../service/auth')

router.post('/',(req,res)=>{
    remove_uuid(req.cookies?.uid)
    res.status(200).json("logout")
    
})

module.exports = router 
