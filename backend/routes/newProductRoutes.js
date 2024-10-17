const express = require("express");
const {addProduct, getProduct,updateProduct,deleteProduct,getSingleProduct, togglestatus} = require("../controller/newProductController")
const router = express.Router();


router.post("/products",addProduct)
router.get("/products",getProduct)
router.put('/products/:id', updateProduct);
router.delete("/products/:id",deleteProduct)
router.get("/products/:id",getSingleProduct);
router.put("/products/:productId/variants/:variantId/toggleActive",togglestatus)
module.exports = router;