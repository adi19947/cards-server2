
const Joi = require("joi");

const registerValidation = (user) => {
    const phoneRegex = /^0(5[0-9]|7[23489]|77[0-9])[0-9]{7}$/;
    const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*-]).{9,}$/;
    const imageUrlRegex = /\.(jpeg|jpg|gif|png)$/i;
    const schema = Joi.object({
        name: Joi.object({
            first: Joi.string().min(2).max(256).required(),
            middle: Joi.string().min(2).max(256).allow(''),
            last: Joi.string().min(2).max(256).required(),
        }),
        isBusiness: Joi.boolean().required(),
        phone: Joi.string().ruleset.pattern(phoneRegex
        ).rule({ message: "user phone must be a valid number" }).required(),
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .regex(emailRegex)
            .required()
            .messages({
                'string.pattern.base': 'Invalid email format',
                'string.email': 'Invalid email format',
                'any.required': 'Email is required'
            }),
        password: Joi.string()
            .regex(passwordRegex)
            .required()
            .messages({
                'string.pattern.base': 'Password must contain at least 9 characters, including a capital letter, lowercase letters, a number, and one of the following symbols: !@#$%^&*-',
                'any.required': 'Password is required'
            }),
        image: Joi.object({
            url: Joi.string()
                .regex(imageUrlRegex)
                .messages({
                    'string.pattern.base': 'Invalid image URL format',
                }),
            alt: Joi.string().min(2).max(256),
        }),
        address: Joi.object({
            state: Joi.string().min(2).max(256),
            country: Joi.string().min(2).max(256).required().messages({
                'string.min': 'Country name must be at least 2 characters long',
                'string.max': 'Country name cannot exceed 256 characters',
                'any.required': 'Country name is required'
            }),
            city: Joi.string().min(2).max(256).required().messages({
                'string.min': 'City name must be at least 2 characters long',
                'string.max': 'City name cannot exceed 256 characters',
                'any.required': 'City name is required'
            }),
            street: Joi.string().min(2).max(256).required().messages({
                'string.min': 'Street name must be at least 2 characters long',
                'string.max': 'Street name cannot exceed 256 characters',
                'any.required': 'Street name is required'
            }),
            houseNumber: Joi.string()
                .regex(/^\d+[a-zA-Z]?$/)
                .custom((value, helpers) => {
                    const number = parseInt(value, 10);
                    if (isNaN(number) || (value.length === 1 && number === 0)) {
                        return helpers.error('any.invalid');
                    }
                    return value;
                }, 'custom validation')
                .required()
                .messages({
                    'string.pattern.base': 'Invalid house number format',
                    'any.invalid': 'House number must contain at least one non-zero digit',
                    'any.required': 'House number is required'
                }),
            zip: Joi.string().min(4),
        })

    });
    return schema.validate(user);
};

module.exports = registerValidation;