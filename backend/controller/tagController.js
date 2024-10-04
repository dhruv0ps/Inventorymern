const Tag = require("../model/productTag");

const addTag = async (req, res) => {
    const { name } = req.body;
    try {
        const newTag = new Tag({ name });
        await newTag.save();
        res.status(201).json(newTag);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error adding tag' });
    }
};
  

const getTag = async(req,res) => {
    try{
        const alltags = await Tag.find();

        res.status(201).json(alltags);

    }
    
    catch (error) {
        res.status(500).json({ message: 'Error fetching  tag' });
    }
}
    

const deleteTag = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedTag = await Tag.findByIdAndDelete(id);
  
      if (!deletedTag) {
        return res.status(404).json({ message: 'Tag not found' });
      }
  
      res.status(200).json({ message: 'Tag deleted successfully', deletedTag });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
const updateTag = async(req,res) => {
        const {name} = req.body
        try{
          const updateTag = await Tag.findByIdAndUpdate(req.params.id,{name},{  new : true});
          res.json(updateTag)
        }
        catch (error){
            res.status(500).json({ message: 'Error updating tag' });
        }
}

module.exports = {
    addTag,getTag,deleteTag,updateTag
}