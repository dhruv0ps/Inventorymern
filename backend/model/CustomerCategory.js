const mongoose = require('mongoose');

const customerCategorySchema = new mongoose.Schema({
    customercategoryId: { type: String, required: true, unique: true },
    customercategoryName: { type: String, required: true, unique: true }, // Ensure uniqueness
    customercategoryDescription: { type: String, required: true },
});

// Ensure there's an index for the name field if you're using it uniquely
customerCategorySchema.index({ customercategoryName: 1 }, { unique: true });

module.exports = mongoose.model('CustomerCategory', customerCategorySchema);
