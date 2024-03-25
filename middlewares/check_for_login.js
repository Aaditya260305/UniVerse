const { getUser } = require("../service/auth");

async function check_login(req, res, next) {
    const userUid = req.cookies.uid;

    if (!userUid) {
        console.log("Go back to login page");
        res.end();
    }//Redirect to login page

    if (!getUser(userUid)) {
        console.log("Go back to Login page");
        res.end();
    }

    req.user = getUser(userUid);
    next();
}

module.exports = {
    check_login,
}