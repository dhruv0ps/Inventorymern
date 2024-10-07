const Productcategories = require("../model/Productcategorie");


const addcategorie = async(req,res) => {
    const {name ,description} = req.body;
      try{
       const existingcategorie = await Productcategories.find({name});
       if(!existingcategorie){
        return res.status(400).json({ message: "Category already exists" });
       }
       const newcategorie = new Productcategories({
        name ,description
       })

       await newcategorie.save();
       return res.status(201).json({message : "categorie added successfullt"})
      }
      catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }

}

const getAllCategorie = async(req,res) => {
    const allcategorie = await Productcategories.find();

      return res.status(200).json(allcategorie);

}

const deletCategorie = async(req,res) => {
    try{
       await Productcategories.findByIdAndDelete(req.params.id);
       res.status(204).send();

    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const updatecategorie = async(req,res) => {
    const { name, description } = req.body;
    try {
        const updatedCategory = await Productcategories.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
        res.json(updatedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
module.exports = {addcategorie,getAllCategorie,deletCategorie,updatecategorie};