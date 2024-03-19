//for signup of users
const { v4: uuidv4 } = require("uuid")
const personal_user = require("../models/PersonalDetails")
const { setUser } = require("../service/auth")


async function UserSignup(req, res) {
    try {
        const { name, rollNo, email, age, gender, password } = req.body;
        await personal_user.create({
            name,
            rollNo,
            email,
            age,
            gender,
            password,
        });
        console.log("User Signup Successful.");
        //redirect to Login Page
        return res.json({ message: "User Signup Successful." });
    }
    catch (error) {
        console.log("User Signup Failed.");
        //redirect to Login Page
        return res.json({ message: "User Signup Failed." });
    }
}

async function UserLogin(req, res) {
    const user = await personal_user.findOne({ rollNo : req.body.rollNo, password:req.body.password });
    if (!user) {
        console.log("Incorrect rollNo or password.");
        return res.json({ message: "Incorrect rollNo or password." })
        //Redirect again to Home page
    }
    console.log("User Login Successful.");
    //Redirect To Home Page
    const sessionId = uuidv4();
    setUser(sessionId, user);
    res.cookie("uid", sessionId);
    return res.json({ message: "User Login Successful." })
}

module.exports = {
    UserSignup,
    UserLogin,
};

