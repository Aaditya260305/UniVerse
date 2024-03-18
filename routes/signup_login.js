const express = require("express");
const { UserSignup, UserLogin } = require("../controllers/user");

const router = express.Router();

router.post("/", UserSignup);
router.post("/login", UserLogin);
module.exports = router;

