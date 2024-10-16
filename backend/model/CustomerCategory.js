const mongoose = require('mongoose');

const customerCategorySchema = new mongoose.Schema({
    customercategoryId: { type: String, required: true },
    customercategoryName: { type: String, required: true },
    customercategoryDescription: { type: String, required: true }
});

// You removed the unique index on customercategoryName
// customerCategorySchema.index({ customercategoryName: 1 }, { unique: true });

module.exports = mongoose.model('CustomerCategory', customerCategorySchema);
