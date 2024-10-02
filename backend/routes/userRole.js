const express = require("express");
const { addnewRole, updateUserRole } = require("../controller/userRoleController");

const router = express.Router();

router.post('/roles', addnewRole); 
router.put('/users/:userId/role', updateUserRole); 

module.exports = router; 
