const express = require('express');
const router = express.Router();
const upload = require('../util/multer'); 
const {  createRawMaterial,updateRawMaterial,deleteRawMaterial,getRawmaterial } = require('../controller/rawController'); 

router.post('/raw-materials', upload.single('image'), createRawMaterial);
router.put('/raw-materials/:id', upload.single('image'), updateRawMaterial);
router.delete('/raw-materials/:id', deleteRawMaterial);
router.get("/raw-materials",getRawmaterial)
module.exports = router;
