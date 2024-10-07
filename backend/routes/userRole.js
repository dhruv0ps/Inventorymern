const express = require("express");
const { addnewRole, updateUserRole,getRole } = require("../controller/userRoleController");

const router = express.Router();

router.post('/roles', addnewRole); 
router.put('/users/:userId/role', updateUserRole); 
router.get("/roles",getRole);

module.exports = router; 
