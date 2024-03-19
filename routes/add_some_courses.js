const express = require('express')

// model needed
const Course = require("../models/course");


const router = express.Router()


// power given only to admin to add courses
router.post("/", async (req, res) => {
    try {
      console.log(req.body);
      const newCourse = new Course(req.body);
      const savedCourse = await newCourse.save();
      res.status(201).json(savedCourse);
    } 
    catch (error) {
      console.error("Error adding course:", error);
      res.status(500).json({ error: "Failed to add course" });
    }
    res.end();
  });

module.exports=router