const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    location: Joi.string().required(),
    language: Joi.string().required(),
    pincode: Joi.string().required(),
    mobile: Joi.string().length(10).pattern(/^[0-9]+$/).required()
});

const loginSchema = Joi.object({
    identifier: Joi.string().required(), // email or mobile
    password: Joi.string().required()
});

const productSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    base_price: Joi.number().required(),
    deadline: Joi.date().greater('now').required(),
    product_age: Joi.string().required()
    // Images are handled via multer, not body JSON validation mostly, but we validate strictly if needed.
});

const bidSchema = Joi.object({
    amount: Joi.number().required()
});

const emailSchema = Joi.object({
    email: Joi.string().email().required()
});

const mobileSchema = Joi.object({
    mobile: Joi.string().length(10).pattern(/^[0-9]+$/).required()
});

const passwordSchema = Joi.object({
    password: Joi.string().min(6).required()
});

module.exports = {
    registerSchema,
    loginSchema,
    productSchema,
    bidSchema,
    emailSchema,
    mobileSchema,
    passwordSchema
};
