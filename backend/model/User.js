const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email:{ type : String},

    role: { type: String,   default: 'admin' },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' }
});

module.exports = mongoose.model('User', userSchema);
