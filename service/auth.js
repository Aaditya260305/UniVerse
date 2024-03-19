const sessionIdToUserMap = new Map();

function setUser(id, user) {
    sessionIdToUserMap.set(id, user);
}

function getUser(id) {
    return sessionIdToUserMap.get(id);
}

async function checking_login(req,res,uid){
    console.log(uid)
    console.log(sessionIdToUserMap.get(uid))
    console.log(sessionIdToUserMap.has(uid))
    if (sessionIdToUserMap.has(uid)){
        req.user =sessionIdToUserMap.get(uid)
        return true;
    }
    else{
        return false;
    }
}


module.exports = {
    setUser,
    getUser,
    checking_login,
};