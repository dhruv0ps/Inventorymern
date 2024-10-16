const RawMaterial = require("../model/rawmaterial");


const createRawMaterial = async (req, res) => {
    try {
        const { material, description, measuringUnit } = req.body;

        
        const newRawMaterial = new RawMaterial({
            material,
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

const getSingleRawMaterial = async (req, res) => {
    try {
        const { id } = req.params;

        const rawMaterial = await RawMaterial.findById(id);

        if (!rawMaterial) {
            return res.status(404).json({ message: "Raw material not found" });
        }

        res.status(200).json(rawMaterial);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

const updateRawMaterial = (req, res) => {
    const { id } = req.params;
    const { material, description, measuringUnit } = req.body;

    const updateData = { material, description, measuringUnit };

    // If there's an uploaded file, replace the backslashes in the file path
    if (req.file) {
        updateData.image = req.file.path.replace(/\\/g, '/');
    }

    // Find the raw material by ID and update it
    RawMaterial.findByIdAndUpdate(id, updateData, { new: true })
        .then(updatedRawMaterial => {
            // If no raw material is found, return a 404 error
            if (!updatedRawMaterial) {
                return res.status(404).json({ message: "Raw material not found" });
            }

            // Return the updated raw material along with a success message
            res.status(200).json({
                message: "Raw material updated successfully",
                updatedRawMaterial,
            });
        })
        .catch(error => {
            // Handle any errors that occur during the update
            res.status(400).json({ message: error.message });
        });
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

module.exports = { createRawMaterial, deleteRawMaterial, updateRawMaterial, getRawmaterial ,getSingleRawMaterial};