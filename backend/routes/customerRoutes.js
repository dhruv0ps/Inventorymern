const express = require("express");
const {newCustomer,getCustomer,updateCustomer,deleteCustomer} = require("../controller/customerController");

const router = express.Router();
const auth = require("../middleware/auth");

router.post("/",auth,newCustomer);
router.get("/",auth,getCustomer)
router.put('/:customerId',auth, updateCustomer);
router.delete("/:customerId",auth,deleteCustomer);
module.exports = router;
