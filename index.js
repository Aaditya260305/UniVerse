const { error } = require("console");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const cookieParser = require("cookie-parser");

const User = require("./models/user");
const Course = require("./models/course");
const Announ = require("./models/Announcement");
const personal_user  = require('./models/PersonalDetails')

// Routes importing 
const userRoute = require("./routes/user");

const app = express();
const port = 5000;

// for storing file and pdfs using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    return cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// MAKING CONNNECTION WITH DATABASE
mongoose
  .connect("mongodb://127.0.0.1:27017/UniVerse")
  .then(console.log("database connected"))
  .catch((err) => console.log(err.message));

// MIDDLEWARE FOR PARSING DATA INTO UNDERSTANDABLE FORM BY SERVER
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// LOGIN ROUTE
app.use("/signup", userRoute);

// HOME PAGE ROUTE
app.get("/home_page", (req, res) => {});

// ROUTE THAT SHOW THE COURSES FOR THE STUDENT FOR THE SEMESTER HE CHOOSES ASSUMED DEPARTMENT IS RETRIVED AND SEND IN BODY
app.get("/semester", (req, res) => {
  Course.find({ department: req.body.department, semester: req.body.semester })
    .then((foundCourses) => {
      res.json(foundCourses);
      console.log(foundCourses);
    })
    .catch((error) => {
      console.error("Error retrieving courses:", error);
      res.status(500).send("Error retrieving courses");
    });
});

// NOT USED NOW BUT MAY BE USED
app.get("/course", (req, res) => {
  Course.find({ title: req.body.title })
    .then((foundCourses) => {
      res.json(foundCourses);
      console.log(foundCourses);
    })
    .catch((error) => {
      console.error("Error retrieving courses:", error);
      res.status(500).send("Error retrieving courses");
    });
});

// ADD SOME COURSES
app.post("/add_courses", async (req, res) => {
  try {
    console.log(req.body);
    const newCourse = new Course(req.body);
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ error: "Failed to add course" });
  }
  res.end();
});

// only admin can add  pdf in the courses
app.post("/courses/add_pdf", upload.single("file_pdf"), async (req, res) => {
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
    res
      .status(200)
      .json({
        message: "File locations added to notes array successfully",
        course,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to add file locations to notes array",
        error: error.message,
      });
  }
});

// getting list of all files under pdf section
app.get("/pdf/:course", (req, res) => {
  var course = req.params.course;
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
app.get("/pdf/:filename", (req, res) => {
  const fileName = req.params.filename;
  console.log(fileName);
  const filePath = path.join(__dirname, "uploads", fileName);
  console.log(filePath);

  // only pdf file can be loaded not others
  var data = fs.readFileSync(filePath);
  res.contentType("application/pdf");
  res.send(data);
  res.end();
});

// deleting some pdf file from server
app.delete("/delete_pdf/:filename", async (req, res) => {
  const fileName = req.params.filename;
  const uploadDir = path.join(__dirname, "uploads");
  const filePath = path.join(uploadDir, fileName);
  console.log(filePath);

  try {
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      return res.status(404).json({ message: "File not found" });
    }
    await fs.unlink(filePath);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    // Failed to delete the file
    res
      .status(500)
      .json({ message: "Failed to delete file", error: error.message });
  }
});

app.post("/announcements", async (req, res) => {
  try {
    const { title, body } = req.body;
    const newAnnoun = new Announ({
      title,
      body,
      date: Date.now(),
    });
    await newAnnoun.save();
    res.status(201).json({ message: "Announcement created successfully;" });
  } catch (error) {
    console.log("Error creating Announcement:", error);
    res.status(500).json({ error: "Error encountered" });
  }
});

app.get("/announcements", async (req, res) => {
  try {
    const announcements = await Announ.find().sort({ date: -1 }).limit(5);
    res.json(announcements);
  } catch (error) {
    console / log("Error fetching announcements:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//C:\Users\aaditya\Desktop\aaditya\sem_breaker\uploads\DAA_ASSIGNMENT.pdf

app.listen(port, () => console.log("server is running on " + port));
