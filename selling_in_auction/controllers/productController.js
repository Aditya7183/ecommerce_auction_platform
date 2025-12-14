const { v4: uuidv4 } = require('uuid');
const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
    try {
        const { title, description, category, base_price, dead_line, older_age } = req.body; // 'older_age' maps to 'how many days or years... older' -> product_age

        // Validation for images
        if (!req.files || req.files.length < 1) {
            return res.status(400).json({ message: 'Minimum 3 images specific required.' });
        }
        if (req.files.length > 10) {
            return res.status(400).json({ message: 'Maximum 10 images allowed.' });
        }

        const images = req.files.map(file => file.path);

        const productId = uuidv4();

        // Map fields from request to DB schema
        // user prompts: title, description, category, base_price, dead-line, (vechiles, electronic-gadgets), images. how many days or years or months older
        // DB schema: name, description, type_category, base_price, deadline, images, product_age

        await Product.create({
            id: productId,
            user_id: req.user.id, // From auth middleware
            name: title,
            description,
            type_category: category,
            base_price: parseFloat(base_price),
            deadline: dead_line, // Assuming valid date string or timestamp
            images,
            product_age: older_age
        });

        res.status(201).json({ message: 'Product added successfully', productId });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Parse images JSON
        if (product.images) product.images = JSON.parse(product.images);

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const { category, location } = req.query;
        // category in prompt is "latest products of these will be returned"
        const products = await Product.findAll({ category, location });

        // Parse images
        products.forEach(p => {
            if (p.images) p.images = JSON.parse(p.images);
        });

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.searchProducts = async (req, res) => {
    try {
        const { q } = req.query; // Search query
        const products = await Product.findAll({ search: q });

        products.forEach(p => {
            if (p.images) p.images = JSON.parse(p.images);
        });

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMyProducts = async (req, res) => {
    try {
        const products = await Product.findByUserId(req.user.id);

        products.forEach(p => {
            if (p.images) p.images = JSON.parse(p.images);
        });

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
