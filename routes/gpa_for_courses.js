const express = require('express')
const router = express.Router()

// model importing
const individual_course_result = require('../models/individual_courses_result');

// model 
// const model = require('../models/result_according_to_semester')

// individual course ka gpa

router.get('/',async (req,res)=>{
    const roll = req.user.rollNo;
    const course = req.body.course;

    try {
        const data = await sem_result_all.find({rollNo:roll , semester:course});
        console.log(data[0]);
        res.status(201).json({sgpa:data[0].sgpa});
    }
    catch (error) {
        console.log(error)
        res.status(500);
    }
    res.end();
})


router.post('/' , async(req,res)=>{
    const roll = req.body.rollNo;
    const course = req.body.course;
    const gpa = req.body.gpa ; 

    // console.log(roll)
    // console.log(course)
    // console.log(gpa)

    try {
        const result_to_add = new sem_result_all({
            rollNo : roll,
            course : course,
            gpa : gpa,
        });
        await result_to_add.save();

        console.log("data added");
        res.status(201).json(req.body);
    }
    catch (error) {
        console.log(error)  
        res.status(500);
    }
    // res.end();
})

module.exports=router;

