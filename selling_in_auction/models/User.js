const db = require('../config/database');

const User = {
    create: async (user) => {
        const sql = `INSERT INTO users (id, name, email, password_hash, location, pin_code, mobile, language) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
        const result = await db.query(sql, [user.id, user.name, user.email, user.password_hash, user.location, user.pin_code, user.mobile, user.language]);
        return result.rows[0];
    },
    findByEmail: async (email) => {
        const result = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        return result.rows[0];
    },
    findByMobile: async (mobile) => {
        const result = await db.query(`SELECT * FROM users WHERE mobile = $1`, [mobile]);
        return result.rows[0];
    },
    findById: async (id) => {
        const result = await db.query(`SELECT id, name, email, location, pin_code, mobile, language, created_at FROM users WHERE id = $1`, [id]);
        return result.rows[0];
    },
    updateEmail: async (id, email) => {
        const result = await db.query(`UPDATE users SET email = $1 WHERE id = $2`, [email, id]);
        return result;
    },
    updateMobile: async (id, mobile) => {
        const result = await db.query(`UPDATE users SET mobile = $1 WHERE id = $2`, [mobile, id]);
        return result;
    },
    updatePassword: async (id, password_hash) => {
        const result = await db.query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [password_hash, id]);
        return result;
    }
};

module.exports = User;
