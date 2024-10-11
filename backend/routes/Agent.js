const express = require("express");

const router = express.Router();
const {createAgent,getAgent,deleteAgent,updateAgent,statusagent} = require("../controller/agentController");
const auth = require("../middleware/auth");

router.post("/",auth,createAgent)
router.get("/",auth,getAgent)
router.delete("/:id",auth, deleteAgent);
router.put("/:id",auth,updateAgent);
router.patch("/status/:id",auth, statusagent); 

module.exports = router;