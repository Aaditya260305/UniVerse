const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");

//model
const Course = require("../models/course");


function check_if_teacher_or_admin(req){
  return req.user.type==="admin" || req.user.type==="teacher";
}

// finding and application
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// BASE ADDRESS ---- /course/pdf

// pdf uploading
router.post("/upload_pdf" , upload.single("file_pdf"), async (req, res) => {
  
  if(check_if_teacher_or_admin(req)){
    console.log(req.file);
    console.log(req.file.path);
    // res.json(req.file.originalname)
    console.log(req.body);

    // assuming i have the course in the requqest must be taken care from frontend

    try {
      const course = await Course.find({ title: req.body.course });
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Add file locations to the notes array
      course[0].notes.push(req.file.path);
      await course[0].save();
      res.status(200).json({
        message: "File locations added to notes array successfully",
        course,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to add file locations to notes array",
        error: error.message,
      });
    }
  }
  else{
    return res.status(401).send("you are not admin or teacher");
  }
});

// getting list/names of all files under pdf section under some specific course
router.get("/", (req, res) => {
  var course = req.body.course;
  Course.find({ title: course })
    .then((foundpdf) => {
      var reply = [];
      var note = foundpdf[0].notes;
      for (i = 0; i < note.length; i++) {
        reply.push(path.basename(note[i]));
      }
      res.json(reply);
    })
    .catch((error) => {
      console.error("Error retrieving courses:", error);
      res.status(500).send("Error retrieving courses");
    });
});


// user can get file with filename coming from the frontend
router.get("/files", async (req, res) => {
  const fileName = req.body.filename;
  console.log(fileName);

  const filePath = path.join('./uploads', fileName);
  console.log(filePath);

  // only pdf file can be loaded not others

  const exists = await fs.pathExists(filePath);
  if (!exists) {
      return res.status(404).json({ message: "File not found" });
  }

  var data = fs.readFileSync(filePath);
  res.contentType("application/pdf");
  res.send(data);
  res.end();

});

// deleting some pdf file from server
// course is there in body
router.delete("/delete", async (req, res) => {
    const fileName = req.body.filename;
    const filePath = path.join('./uploads', fileName);
    console.log(filePath);
  
    if(check_if_teacher_or_admin(req)){
      try {
        const exists = await fs.pathExists(filePath);
        if (!exists) {
          return res.status(404).json({ message: "File not found" });
        }
        await fs.unlink(filePath);
  
  
        const stringToRemove = "uploads\\"+fileName; // The string to remove from the notes array
        console.log(stringToRemove)
  
        try {        // Update the course document to remove all occurrences of the specified string from the notes array
          const course = await Course.findOne({ title: req.body.course });
  
            if (!course) {
              return res.status(404).json({ message: 'Course not found' });
            }
  
            // Remove all occurrences of the specified string from the notes array
            course.notes = course.notes.filter(note => note !== stringToRemove);
  
            // Save the updated course document
            await course.save();
  
            res.status(200).json({ message: 'Occurrences of the string removed from the notes array', course });
          } 
        catch (error) {
          res.status(500).json({ message: 'Failed to remove occurrences of the string from the notes array', error: error.message });
        }
  
      } catch (error) {
        // Failed to delete the file
        console.log(error.message)
        res
          .status(500)  
          .json({ message: "Failed to delete file", error: error.message });
      }
    }
    else{
      return res.status(401).send("you are not admin or teacher")
    }
    
  });



module.exports = router;
