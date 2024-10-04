const express = require("express");
const {addProduct, getProduct,updateProduct} = require("../controller/newProductController")
const router = express.Router();


router.post("/products",addProduct)
router.get("/products",getProduct)
router.put('/products/:id', updateProduct);
module.exports = router;