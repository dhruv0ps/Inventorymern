const express = require("express");
const {addProduct, getProduct,updateProduct,deleteProduct,getSingleProduct} = require("../controller/newProductController")
const router = express.Router();


router.post("/products",addProduct)
router.get("/products",getProduct)
router.put('/products/:id', updateProduct);
router.delete("/products/:id",deleteProduct)
router.get("/products/:id",getSingleProduct);
module.exports = router;