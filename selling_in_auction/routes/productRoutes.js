const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
// Note: validation for products happens in controller partially because of formdata/file upload, 
// strictly Joi on body works but req.body is different with multer. 
// We will rely on controller logic for complex formdata validation or parse first? 
// Multer handles parsing. Joi can validate req.body after Multer runs.

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               base_price:
 *                 type: number
 *               dead_line:
 *                 type: string
 *                 format: date-time
 *               older_age:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/', authMiddleware, upload.array('images', 10), productController.addProduct);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 */
// Prompt says "for each and every request use the authorization expect authentication". So even GET needs auth.
router.get('/:id', authMiddleware, productController.getProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get products with filters
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', authMiddleware, productController.getProducts);

/**
 * @swagger
 * /products/search/query:
 *   get:
 *     summary: Search products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search/query', authMiddleware, productController.searchProducts);

/**
 * @swagger
 * /products/user/me:
 *   get:
 *     summary: Get my products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's products
 */
router.get('/user/me', authMiddleware, productController.getMyProducts);

module.exports = router;
