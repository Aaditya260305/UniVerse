const express = require("express");

// model importing 
const Announ = require("../models/Announcement");

const router = express.Router();

function check_if_teacher_or_admin(req){
  return req.user.type==="admin" || req.user.type==="teacher";
}

router.post("/", async (req, res) => {
  if(check_if_teacher_or_admin(req)){
    try {
      // const { title, body } = req.body;
      console.log(req.body)
      const newAnnounce = new Announ({
        title : req.body.title,
        body : req.body.body,
        date: Date.now(),
      });
      await newAnnounce.save();
      res.status(201).json({ message: "Announcement created successfully;" });
    } 
    catch (error) {
      console.log("Error creating Announcement:", error);
      res.status(500).json({ error: "Error encountered" });
    }
  }
  else{
    return res.status(401).send("you are not admin or teacher");
  }
});

router.get("/", async (req, res) => {
  try {
    const announcements = await Announ.find().sort({ date: -1 }).limit(5);
    res.json(announcements);
  } catch (error) {
    console.log("Error fetching announcements:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router 
