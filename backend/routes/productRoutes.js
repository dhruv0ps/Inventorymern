const express = require("express");
const {addcategorie,getAllCategorie,deletCategorie,updatecategorie} = require("../controller/productController")
const auth = require("../middleware/auth");
const router = express.Router();


router.post('/categories',auth,addcategorie);
router.get('/categories',auth, getAllCategorie);
router.delete("/categories/:id",auth,deletCategorie)
router.put("/categories/:id",auth,updatecategorie)
module.exports = router;

