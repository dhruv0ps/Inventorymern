const express = require("express")

const router = express.Router();

const {addTag,getTag,deleteTag,updateTag} = require("../controller/tagController")

router.get("/tags",getTag);
router.put("/tags/:id",updateTag)
router.post("/tags",addTag);
router.delete("/tags/:id",deleteTag);

module.exports = router;
