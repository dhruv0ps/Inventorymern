const Products = require("../model/newProduct");
const DeletedSKUs = require("../model/deletedSKU");
const generateNextSKU = async () => {
  
    const existingProducts = await Products.find().select('SKU');
    const existingSKUs = existingProducts.map(product => product.SKU);
    
    // Find all deleted SKUs
    const deletedSKUs = await DeletedSKUs.find().select('SKU');
    const allSKUs = [...existingSKUs, ...deletedSKUs.map(deleted => deleted.SKU)];

    // Find the last SKU based on existing products
    const lastProduct = await Products.findOne().sort({ SKU: -1 }).select('SKU');

    let newSKU;
    let newSKUIndex; // Declare newSKUIndex here

    if (lastProduct) {
        const lastSKU = lastProduct.SKU;
        const skuNumber = parseInt(lastSKU.replace(/[^\d]/g, ''), 10);

        if (isNaN(skuNumber)) {
            throw new Error('Invalid SKU format in database.');
        }

        // Generate the next SKU number
        newSKUIndex = skuNumber + 1; // Initialize newSKUIndex

        // Create the new SKU string
        newSKU = `ALP${newSKUIndex.toString().padStart(4, '0')}`;
    } else {
        newSKU = 'ALP0001'; // Start from the beginning if no products exist
        newSKUIndex = 1; 
    }

    
    while (allSKUs.includes(newSKU)) {
        newSKUIndex += 1; 
        newSKU = `ALP${newSKUIndex.toString().padStart(4, '0')}`;
    }

    return newSKU;
};

const generateChildSKU = (parentSKU, index) => {
    return `${parentSKU}-${index + 1}`; 
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
        category,
        color,
    } = req.body;

    try {
        const newSKU = await generateNextSKU(); 
        const newVariants = variants.map((variant, index) => ({
            ...variant,
            SKU: generateChildSKU(newSKU, index), 
        }));

        const newProduct = new Products({
            parentName,
            variants: newVariants,
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
            category,
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully!', SKU: newSKU, product: newProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


const getProduct = async (req, res) => {
    try {
        const { color, minPrice, maxPrice, size, search } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { SKU: { $regex: search, $options: "i" } },
                { "variants.childName": { $regex: search, $options: "i" } }
            ];
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

        const products = await Products.find(query); // Ensure query is applied
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
};


const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Products.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        const deletedSKUEntry = new DeletedSKUs({ SKU: deletedProduct.SKU });
        await deletedSKUEntry.save();


        res.status(200).json({ message: 'Product deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product', error });
    }
};


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
        category
    } = req.body;

    try {
        // Fetch the existing product from the database
        const existingProduct = await Products.findById(id);

        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Map the new variants but keep the existing SKU constant
        const updatedVariants = variants.map((variant, index) => ({
            ...variant,
            SKU: existingProduct.variants[index]?.SKU || generateChildSKU(existingProduct.SKU, index) // Keep existing SKU or generate if needed
        }));

        // Update the product without modifying the SKU
        const updatedProduct = await Products.findByIdAndUpdate(
            id,
            {
                parentName,
                variants: updatedVariants,
                name,
                description,
                regularPrice,
                weight,
                dimensions,
                construction,
                rawMaterials,
                tags,
                color,
                category
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: 'Product updated successfully!', product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error });
    }
};


const getSingleProduct = async (req, res) => {
    const { id } = req.params;
    try {
      
        const product = await Products.findById(id);

        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product', error });
    }
};


const togglestatus = async (req, res) => {
    try {
        const { productId, variantId } = req.params;

        const product = await Products.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const variant = product.variants.id(variantId);
        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' });
        }

        variant.isActive = !variant.isActive;

        await product.save();

        res.status(200).json({ message: 'Variant status updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { addProduct, getProduct, deleteProduct, updateProduct, getSingleProduct, togglestatus };
