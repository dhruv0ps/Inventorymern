const express = require("express");
const {newCustomer,getCustomer,updateCustomer,deleteCustomer, toggleCustomerStatus,getsingleCustomer} = require("../controller/customerController");

const router = express.Router();
const auth = require("../middleware/auth");

router.post("/",auth,newCustomer);
router.get("/",auth,getCustomer)
router.put('/:customerId',auth, updateCustomer);
router.delete("/:customerId",auth,deleteCustomer);
router.patch("/:customerId/status",auth,toggleCustomerStatus)
router.get("/:customerId",auth, getsingleCustomer);
module.exports = router;
