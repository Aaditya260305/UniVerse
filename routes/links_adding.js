const express = require("express");
const router = express.Router();

//model
const Course = require("../models/course");

function check_if_teacher_or_admin(req) {
  return req.user.type === "admin" || req.user.type === "teacher";
}

// getting links under links section under some specific course
router.get("/", (req, res) => {
  var course = req.body.course;
  Course.find({ title: course })
    .then((foundlinks) => {
      var reply = [];
      var note = foundlinks[0].links;

      console.log(note);
      console.log(note.length)

      for (i = 0; i < note.length; i++) {
        reply.push(note[i]);
        console.log(note[i]);
      }
      res.json(reply);
    })
    .catch((error) => {
      console.error("Error retrieving links", error);
      res.status(500).send("Error retrieving links");
    });
});

router.post("/", async (req, res) => {
  const link_add = req.body.link_address;
  const name_of_video = req.body.name_of_video;

  if (check_if_teacher_or_admin(req)) {
    try {
      const course = await Course.find({ title: req.body.course });
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Add file locations to the notes array
      const myObj = {"name_of_video": name_of_video , "link":link_add};
      const myJSON = JSON.stringify(myObj);
      course[0].links.push(myJSON);
      await course[0].save();
      res.status(200).json({
        message: "File locations added to links array successfully",
        course,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to add file locations to notes array",
        error: error.message,
      });
    }
  } else {
    return res.status(401).send("you are not admin or teacher");
  }
});

router.delete("/", async (req, res) => {
  const name_of_video = req.body.name_of_video;
  const stringToRemove = req.body.link_address;
  // console.log(stringToRemove)

  const myObj = {"name_of_video": name_of_video , "link":stringToRemove};
  const myJSON = JSON.stringify(myObj);

  if (check_if_teacher_or_admin(req)) {
    try {
      // Update the course document to remove all occurrences of the specified string from the notes array
      const course = await Course.findOne({ title: req.body.course });

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Remove all occurrences of the specified string from the notes array
      course.links = course.links.filter((link) => link !== myJSON);

      // console.log(course.notes)

      // Save the updated course document
      await course.save();

      res.status(200).json({
        message: "Occurrences of the string removed from the notes array",
        course,
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to remove occurrences of the string from the notes array",
        error: error.message,
      });
    }
  } else {
    return res.status(401).send("you are not admin or teacher");
  }
});

module.exports = router;
