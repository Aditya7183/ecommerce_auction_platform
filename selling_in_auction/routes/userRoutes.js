const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { emailSchema, mobileSchema, passwordSchema } = require('../utils/validationSchemas');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile management
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
router.get('/profile', authMiddleware, userController.getProfile);

/**
 * @swagger
 * /user/update-email:
 *   put:
 *     summary: Update email
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email updated
 */
router.put('/update-email', authMiddleware, validate(emailSchema), userController.updateEmail);

/**
 * @swagger
 * /user/update-mobile:
 *   put:
 *     summary: Update mobile number
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *             properties:
 *               mobile:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mobile updated
 */
router.put('/update-mobile', authMiddleware, validate(mobileSchema), userController.updateMobile);

/**
 * @swagger
 * /user/update-password:
 *   put:
 *     summary: Update password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 */
router.put('/update-password', authMiddleware, validate(passwordSchema), userController.updatePassword);

module.exports = router;
