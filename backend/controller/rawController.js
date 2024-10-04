const RawMaterial = require("../model/rawmaterial");


const createRawMaterial = async (req, res) => {
    try {
        const { name, description, measuringUnit } = req.body;

        
        const newRawMaterial = new RawMaterial({
            name,
            description,
            image: req.file ? req.file.path.replace(/\\/g, '/') : null, 
            measuringUnit,
        });

        await newRawMaterial.save();

        res.status(201).json({
            message: "Raw material created successfully",
            newRawMaterial,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const getRawmaterial = async (req, res) => {
    try {
        const rawMaterials = await RawMaterial.find();
        res.status(200).json(rawMaterials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateRawMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, measuringUnit } = req.body;

       
        const updateData = { name, description, measuringUnit };

        if (req.file) {
            updateData.image = req.file.path.replace(/\\/g, '/');
        }

        const updatedRawMaterial = await RawMaterial.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedRawMaterial) {
            return res.status(404).json({ message: "Raw material not found" });
        }

        res.status(200).json({
            message: "Raw material updated successfully",
            updatedRawMaterial,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const deleteRawMaterial = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRawMaterial = await RawMaterial.findByIdAndDelete(id);

        if (!deletedRawMaterial) {
            return res.status(404).json({ message: "Raw material not found" });
        }

        res.status(200).json({ message: "Raw material deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createRawMaterial, deleteRawMaterial, updateRawMaterial, getRawmaterial };