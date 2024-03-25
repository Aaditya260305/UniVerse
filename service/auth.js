const sessionIdToUserMap = new Map();

function setUser(id, user) {
    sessionIdToUserMap.set(id, user);
}

function getUser(id) {
    return sessionIdToUserMap.get(id);
}

function checking_login(req,res,uid){
    console.log(uid)
    console.log(sessionIdToUserMap.has(uid))
    if (sessionIdToUserMap.has(uid)){
        req.user =sessionIdToUserMap.get(uid)
        return true;
    }
    else{
        return false;
    }
}

function remove_uuid(uid){
    if(sessionIdToUserMap.has(uid)) sessionIdToUserMap.delete(uid)
    console.log(sessionIdToUserMap)
    return;
}

module.exports = {
    setUser,
    getUser,
    checking_login,
    remove_uuid,
};