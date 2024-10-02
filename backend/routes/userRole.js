const express = require("express");
const { addnewRole} = require("../controller/userRoleController")

const routes = express.Router();

router.post('/roles', addNewRole);
router.put('/users/:userId/role', updateUserRole);
module.export = router;