const express = require('express')
const router = express.Router();

// importing model
const personal_user = require("../models/PersonalDetails");
const { model } = require('mongoose');

// base  -> /admin

// admin can make teacher
router.post('/teacher',async(req,res)=>{
    const rollNo = req.body.rollNo;
    console.log(rollNo);

    if(rollNo === req.user.rollNo){
        return res.json({"you cant change yourself":1});
    }

    try{
        // const temp = personal_user.find({rollNo:req.body.rollNo});
        const temp = await personal_user.find({ rollNo : rollNo });
        if(!temp){
            console.log("not present");
            res.send("not present");
            return res.json({"not presnenr":1});
        }
        console.log(temp);
        console.log(temp[0]);
        temp[0].type = "teacher";
        await temp[0].save();
        res.send("updated");
    }
    catch(err){
        console.log(err);
        res.send(err);
    }
})

// admin can make another admin student or make student 
router.post('/student',async(req,res)=>{
    const rollNo = req.body.rollNo;
    console.log(rollNo);

    if(rollNo === req.user.rollNo){
        return res.json({"you cant change yourself":1});
    }

    try{
        // const temp = personal_user.find({rollNo:req.body.rollNo});
        const temp = await personal_user.find({ rollNo : rollNo });
        if(!temp){
            console.log("not present");
            res.send("not present");
            return res.json({"not presnenr":1});
        }
        console.log(temp);
        console.log(temp[0]);
        temp[0].type = "student";
        await temp[0].save();
        res.send("updated");
    }
    catch(err){
        console.log(err);
        res.send(err);
    }
})

// admin can make more admin 
router.post('/admin',async(req,res)=>{
    const rollNo = req.body.rollNo;
    console.log(rollNo);

    if(rollNo === req.user.rollNo){
        return res.json({"you cant change yourself":1});
    }

    try{
        // const temp = personal_user.find({rollNo:req.body.rollNo});
        const temp = await personal_user.find({ rollNo : rollNo });
        if(!temp){
            console.log("not present");
            res.send("not present");
            return res.json({"not presnenr":1});
        }
        console.log(temp);
        console.log(temp[0]);
        temp[0].type = "admin";
        await temp[0].save();
        res.send("updated");
    }
    catch(err){
        console.log(err);
        res.send(err);
    }
})

module.exports = router 
