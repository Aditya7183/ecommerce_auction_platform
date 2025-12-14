const { v4: uuidv4 } = require('uuid');
const Bid = require('../models/Bid');
const Product = require('../models/Product');

exports.placeBid = async (req, res) => {
    try {
        const { product_id } = req.params;
        const { amount } = req.body;
        const userId = req.user.id; // Bidder

        const product = await Product.findById(product_id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Check deadline
        const deadline = new Date(product.deadline);
        if (new Date() > deadline) {
            return res.status(400).json({ message: 'Auction for this product has ended' });
        }

        // Check base price
        if (parseFloat(amount) < product.base_price) {
            return res.status(400).json({ message: 'Bid amount must be greater than base price' });
        }

        // Optional: Check if bid is higher than current highest? Prompt doesn't strictly enforce rejecting lower bids, but "highest bidder gets deal". Usually you block lower bids.
        const currentBids = await Bid.findByProductId(product_id);
        if (currentBids.length > 0) {
            const highestBid = currentBids[0].bidded_amount;
            if (parseFloat(amount) <= highestBid) {
                return res.status(400).json({ message: `Bid amount must be higher than current highest bid: ${highestBid}` });
            }
        }

        const bidId = uuidv4();
        await Bid.create({
            id: bidId,
            product_id,
            user_id: userId,
            bidded_amount: parseFloat(amount)
        });

        res.status(201).json({ message: 'Bid placed successfully', bidId });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMyBids = async (req, res) => {
    try {
        const bids = await Bid.findByUserId(req.user.id);
        res.json(bids);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProductBids = async (req, res) => {
    try {
        const { product_id } = req.params;
        const bids = await Bid.findByProductId(product_id);
        res.json(bids);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
