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
const userRoute = require("./routes/signup_login");
const semester_route = require('./routes/semester_route_showing_courses')
const add_course_route = require('./routes/add_some_courses')
const pdf_route = require('./routes/pdf_in_course')
const announcement_route = require('./routes/announcement')

// function importing
const {checking_login} = require('./service/auth')

const app = express();
const port = 5000;

// for storing file and pdfs using multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     return cb(null, "./uploads/");
//   },
//   filename: function (req, file, cb) {
//     return cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

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

// ROUTE THAT SHOW THE COURSES FOR THE STUDENT FOR THE SEMESTER HE CHOOSES ASSUMED DEPARTMENT IS RETRIVED AND SEND IN BODY
app.use('/semester',semester_route);

// ADD SOME COURSES
app.use('/add_courses', add_course_route )

// only admin can ADD PDF in the courses
app.use("/course/pdf",pdf_route)

app.use('/announcements' , announcement_route)

app.listen(port, () => console.log("server is running on " + port));
