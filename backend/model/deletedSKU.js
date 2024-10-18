const mongoose = require("mongoose");

const DeletedSKUSchema = new mongoose.Schema({
    SKU: {
        type:String,
        required:true,
        unique: true
    },
    deletedAt: {
        type: Date,
        default: Date.now // Store when it was deleted
    }
})

const DeletedSKUs = mongoose.model('DeletedSKUs', DeletedSKUSchema);

module.exports = DeletedSKUs;