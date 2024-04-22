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

// BASE ADDRESS ---- /course/pyq

// pyq uploading
router.post("/upload_pyq", upload.single("file"), async (req, res) => {

  if(check_if_teacher_or_admin(req)===false){
    return res.status(401).send("not an admin or a teacher");
}


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
    
    // Add file locations to the pyq array
    course[0].pyq.push(req.file.path);
    await course[0].save();
    res.status(200).json({
      message: "File locations added to pyq array successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add file locations to pyq array",
      error: error.message,
    });
  }
});

// getting list/names of all files under pdf section under some specific course
router.get("/", (req, res) => {
  var course = req.body.course;
  console.log(course)
  Course.find({ title: course })
    .then((foundpyq) => {
      var reply = [];
      var note = foundpyq[0].pyq;
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
router.get("/files", async(req, res) => {
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

    console.log(data)

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

    if(check_if_teacher_or_admin(req)===false){
      return res.status(401).send("not an admin or a teacher");
    }

  
    try {
      const exists = await fs.pathExists(filePath);
      if (!exists) {
        return res.status(404).json({ message: "File not found" });
      }
      await fs.unlink(filePath);


      const stringToRemove = "uploads\\"+fileName; // The string to remove from the pyq array
      console.log(stringToRemove)

      try {        // Update the course document to remove all occurrences of the specified string from the pyq array
        const course = await Course.findOne({ title: req.body.course });

          if (!course) {
            return res.status(404).json({ message: 'Course not found' });
          }

          // Remove all occurrences of the specified string from the pyq array
          course.pyq = course.pyq.filter(note => note !== stringToRemove);

          // Save the updated course document
          await course.save();

          res.status(200).json({ message: 'Occurrences of the string removed from the pyq array', course });
        } 
      catch (error) {
        res.status(500).json({ message: 'Failed to remove occurrences of the string from the pyq array', error: error.message });
      }

    } catch (error) {
      // Failed to delete the file
      console.log(error.message)
      res
        .status(500)  
        .json({ message: "Failed to delete file", error: error.message });
    }
  });



module.exports = router;
