const db = require('../config/database');

const Product = {
    create: async (product) => {
        const sql = `INSERT INTO products (id, user_id, name, description, type_category, base_price, deadline, images, product_age) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
        const result = await db.query(sql, [product.id, product.user_id, product.name, product.description, product.type_category, product.base_price, product.deadline, JSON.stringify(product.images), product.product_age]);
        return result.rows[0];
    },
    findById: async (id) => {
        const result = await db.query(`
            SELECT p.*, u.name as seller_name, u.mobile as seller_mobile, u.location as seller_location 
            FROM products p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.id = $1`, [id]);
        return result.rows[0];
    },
    findAll: async ({ category, location, search }) => {
        let sql = `SELECT p.*, u.location FROM products p JOIN users u ON p.user_id = u.id WHERE 1=1`;
        const params = [];

        if (category) {
            params.push(`%${category}%`);
            sql += ` AND p.type_category LIKE $${params.length}`;
        }
        if (location) {
            params.push(`%${location}%`);
            sql += ` AND u.location LIKE $${params.length}`;
        }
        if (search) {
            params.push(`%${search}%`);
            // For search we iterate twice for same param? No, safer to push twice if using distinct placeholders, 
            // or use $n for both. Postgres allows reusing $n.
            // But simpler to just push twice for $n, $n+1.
            // OR: "name LIKE $n OR description LIKE $n" (using same index)

            // Let's use same index for simplicity
            sql += ` AND (p.name LIKE $${params.length} OR p.description LIKE $${params.length})`;
        }

        sql += ` ORDER BY p.created_at DESC`;

        const result = await db.query(sql, params);
        return result.rows;
    },
    findByUserId: async (userId) => {
        const result = await db.query(`SELECT * FROM products WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);
        return result.rows;
    }
};

module.exports = Product;
