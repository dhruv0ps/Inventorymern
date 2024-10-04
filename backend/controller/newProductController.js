const Products = require("../model/newProduct");

const generateNextSKU = async () => {
    
    const lastProduct = await Products.findOne().sort({ SKU: -1 }).select('SKU');

    if (!lastProduct) return 'ALP0001';

    const lastSKU = lastProduct.SKU;
    const skuNumber = parseInt(lastSKU.replace(/[^\d]/g, ''), 10);

    if (isNaN(skuNumber)) {
        throw new Error('Invalid SKU format in database.');
    }

  
    let newSKUIndex = skuNumber + 1;
    let newSKU = `ALP${newSKUIndex.toString().padStart(4, '0')}`;

    
    const skuExists = await Products.findOne({ SKU: newSKU });
    while (skuExists) {
        newSKUIndex += 1;
        newSKU = `ALP${newSKUIndex.toString().padStart(4, '0')}`;
    }

    return newSKU;
};

const addProduct = async (req, res) => {
    const {
        parentName,
        variants,
        name,
        description,
        regularPrice,
        weight,
        dimensions,
        construction,
        rawMaterials,
        tags,
        color,
    } = req.body;
   console.log(parentName)
    try {
        const newSKU = await generateNextSKU();
        const newProduct = new Products({
            parentName,
            variants,
            SKU: newSKU,
            name,
            description,
            regularPrice,
            weight,
            dimensions,
            construction,
            rawMaterials,
            tags,
            color,
        });

        
        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully!', SKU: newSKU, product: newProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }

}

const getProduct = async(req,res) => {

    
    try{

        const { color, minPrice, maxPrice, size, search } = req.query;
        let query = {};
        if(search){
            query.$or = [
                { name: { $regex: search, $options: "i" } }, 
                { SKU: { $regex: search, $options: "i" } }
            ]

        }
        if (color) {
            query.color = color;
        }
        if (size) {
            query["variants.size"] = size;
        }
        if (minPrice && maxPrice) {
            query.regularPrice = { $gte: minPrice, $lte: maxPrice };
        }

        const products = await Products.find().populate('tags');
        res.json(products);
    }
    catch(error){
        res.status(500).json({ message: 'Error fetching products', error });
    }
}
const deleteProduct = async(req,res) => {
        try{
                  const deletedProduct = await Products.findByIdAndDelete(id);

                  if(!deletedProduct){
                    return res.status(404).json({message : "Product not found"})
                  }

                  res.status(200).json({ message: 'Product deleted successfully!' });

        }
         catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product', error });

    }
}

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const {
        parentName,
        variants,
        name,
        description,
        regularPrice,
        weight,
        dimensions,
        construction,
        rawMaterials,
        tags,
        color,
    } = req.body;

    try {
       
        const updatedProduct = await Products.findByIdAndUpdate(
            id,
            {
                parentName,
                variants,
                name,
                description,
                regularPrice,
                weight,
                dimensions,
                construction,
                rawMaterials,
                tags,
                color,
            }, 
            { new: true, runValidators: true } 
        );

       
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

    
        res.status(200).json({ message: 'Product updated successfully!', product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error });
    }
};
module.exports = { addProduct ,getProduct, deleteProduct,updateProduct };
