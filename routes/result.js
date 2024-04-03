const express = require('express')
const router = express.Router()

// model importing
const sem_result_all = require('../models/result_according_to_semester');

// model 
// const model = require('../models/result_according_to_semester')


// overall semester ki cgpa ke liye 


router.get('/',async (req,res)=>{
    const roll = req.body.rollNo;
    const sem_no = req.body.semester;

    try {
        const data = await sem_result_all.find({rollNo:roll , semester:sem_no});
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
    const sem_no = req.body.semester;
    const sgpa = req.body.sgpa ; 

    console.log(roll)
    console.log(sem_no)
    console.log(sgpa)

    try {
        const result_to_add = new sem_result_all({
            rollNo : req.body.rollNo,
            semester : req.body.semester,
            sgpa : req.body.sgpa,
        });
        await result_to_add.save();

        console.log("data added");
        res.status(201).json(req.body);
    }
    catch (error) {
        console.log(error)  
        res.status(500);
    }
    console.log("sadf")
    // res.end();
})

module.exports=router;
