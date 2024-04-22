const check_admin = (req, res, next) => {
    console.log(req.user)
    if(req.user.type==="admin"){
        next(); 
    }
    else{
        console.log("not an admin")
        res.status(401).send('you are not an admin');
    }
};

module.exports = {
    check_admin,
}