const { error } = require("console");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// Routes importing 
const userRoute = require("./routes/signup_login");
const semester_route = require('./routes/semester_route_showing_courses')
const add_course_route = require('./routes/add_some_courses')
const pdf_route = require('./routes/pdf_in_course')
const announcement_route = require('./routes/announcement')
const signout_route = require('./routes/singout')
const result_route = require('./routes/result')
const individual_course = require('./routes/gpa_for_courses')

// middlleware importing
const {check_login} = require('./middlewares/check_for_login')

const app = express();
const port = 5000;

// mongodb+srv://iib2022038:acKZwVv2fnUYcNDT@cluster0.0ouumue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

// MAKING CONNNECTION WITH DATABASE
// .connect("mongodb+srv://iib2022038:acKZwVv2fnUYcNDT@cluster0.0ouumue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
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
app.use('/semester',check_login , semester_route);

// ADD SOME COURSES
app.use('/add_courses', check_login , add_course_route )

// only admin can ADD PDF in the courses
app.use("/course/pdf", check_login , pdf_route)

// announcement route
app.use('/announcements' , check_login ,announcement_route)

// result for overall semester
app.use('/result', result_route)

// result for some course 
app.use('/result/course', individual_course)

// signout route
app.use('/signout', check_login ,signout_route)

app.listen(port, () => console.log("server is running on " + port));
