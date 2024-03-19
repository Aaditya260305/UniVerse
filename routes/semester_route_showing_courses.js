const express = require("express");

// model
const Course = require("../models/course");

// function
const {checking_login} = require('../service/auth')

const router = express.Router();


router.get('/', (req, res) => {

    var uid = req.cookies?.uid
    console.log(uid)
  
    if(uid && checking_login(req,res,uid)){
      Course.find({ department: req.body.department, semester: req.body.semester })
        .then((foundCourses) => {
          res.json(foundCourses);
          console.log(foundCourses);
        })
        .catch((error) => {
          console.error("Error retrieving courses:", error);
          res.status(500).send("Error retrieving courses");
        });
    }
    else{
      res.status(200).json("you have not login yet")
    }
})  


module.exports = router;

