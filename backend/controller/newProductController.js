const Products = require("../model/newProduct");

// Generate a new SKU for parent products
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

// Generate a child SKU based on the parent SKU and variant index
const generateChildSKU = (parentSKU, index) => {
    return `${parentSKU}-${index + 1}`; // Format: PARENT-SKU-1, PARENT-SKU-2, etc.
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

    try {
        const newSKU = await generateNextSKU(); // Generate the parent SKU
        const newVariants = variants.map((variant, index) => ({
            ...variant,
            SKU: generateChildSKU(newSKU, index), // Generate SKU for each variant
        }));

        const newProduct = new Products({
            parentName,
            variants: newVariants,
            SKU: newSKU, // Parent SKU
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
};

const getProduct = async (req, res) => {
    try {
        const { color, minPrice, maxPrice, size, search } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { SKU: { $regex: search, $options: "i" } }
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

        const products = await Products.find(query) // Ensure query is applied
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
    } = req.body;

    try {
        const updatedVariants = variants.map((variant, index) => ({
            ...variant,
            SKU: generateChildSKU(req.body.SKU, index) // Ensure child SKU is generated correctly
        }));

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

const getSingleProduct = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        // Fetch the product by ID, populating the tags
        const product = await Products.findById(id);

        // Check if the product exists
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Respond with the product details
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product', error });
    }
};

module.exports = { addProduct, getProduct, deleteProduct, updateProduct, getSingleProduct };
