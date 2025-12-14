const db = require('../config/database');

const Bid = {
    create: async (bid) => {
        const sql = `INSERT INTO bids (id, product_id, user_id, bidded_amount) VALUES ($1, $2, $3, $4) RETURNING *`;
        const result = await db.query(sql, [bid.id, bid.product_id, bid.user_id, bid.bidded_amount]);
        return result.rows[0];
    },
    findByProductId: async (productId) => {
        const result = await db.query(`SELECT b.*, u.name as bidder_name FROM bids b JOIN users u ON b.user_id = u.id WHERE b.product_id = $1 ORDER BY b.bidded_amount DESC`, [productId]);
        return result.rows;
    },
    findByUserId: async (userId) => {
        const result = await db.query(`SELECT b.*, p.name as product_name, p.deadline FROM bids b JOIN products p ON b.product_id = p.id WHERE b.user_id = $1 ORDER BY b.created_at DESC`, [userId]);
        return result.rows;
    }
};

module.exports = Bid;
