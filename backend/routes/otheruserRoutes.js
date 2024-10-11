const express = require("express");
const {loginuser,getUser} = require("../controller/otherController")
const router = express.Router();

router.post("/profilelogin",loginuser);

router.get("/profilelogin/:userId",getUser)
module.exports = router;
