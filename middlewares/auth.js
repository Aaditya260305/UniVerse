const { getUser } = require("../service/auth");


async function restrictToLoggedinUserOnly(req, res, next) {
    const userUid = req.cookies.uid;

    if (!userUid) console.log("Go back to login page");//Redirect to login page

    if (!userUid) console.log("Go back to Login page");

    req.user = userUid;
    next();
}

module.exports = {
    restrictToLoggedinUserOnly,
}