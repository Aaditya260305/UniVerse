const { getUser } = require("../service/auth");
const {checking_login} = require('../service/auth')

const check_login = (req, res, next) => {
    const sessionId = req.cookies.uid;
    
    if(checking_login(req,res,sessionId)){
        // req.user = getUser(sessionId);
        console.log(req.user);
        next(); 
    }
    else{
        res.status(401).send('Invalid session');
    }
};

module.exports = {
    check_login,
}