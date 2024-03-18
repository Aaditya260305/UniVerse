const express = require("express");
const { UserSignup, UserLogin } = require("../controllers/auth");

const router = express.Router();

router.post("/", UserSignup);
router.post("/login", UserLogin);
module.exports = router;

