const express = require("express");

// model importing 
const Announ = require("../models/Announcement");

const router = express.Router();

router.post("/", async (req, res) => {
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
