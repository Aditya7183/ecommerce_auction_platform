const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { bidSchema } = require('../utils/validationSchemas');

/**
 * @swagger
 * tags:
 *   name: Bids
 *   description: Bidding operations
 */

/**
 * @swagger
 * /bids/product/{product_id}:
 *   post:
 *     summary: Place a bid on a product
 *     tags: [Bids]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Bid placed
 */
router.post('/product/:product_id', authMiddleware, validate(bidSchema), bidController.placeBid);

/**
 * @swagger
 * /bids/product/{product_id}:
 *   get:
 *     summary: Get bids for a product
 *     tags: [Bids]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of bids
 */
router.get('/product/:product_id', authMiddleware, bidController.getProductBids);

/**
 * @swagger
 * /bids/me:
 *   get:
 *     summary: Get my bid history
 *     tags: [Bids]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's bids
 */
router.get('/me', authMiddleware, bidController.getMyBids);

module.exports = router;
