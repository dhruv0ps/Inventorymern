const mongoose = require("mongoose");

const productTag = new mongoose.Schema({
    name: {type:String, required:true}
});

const Tag = mongoose.model("Tag",productTag)
module.exports = Tag;