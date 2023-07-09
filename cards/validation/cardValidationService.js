const validateCardWithJoi = require("./joi/validateCardWithJoi");

const config = require("config");
const validator = config.get("VALIDATOR");

const validateCard = (card) => {
    if (validator == "Joi") {
        const { error } = validateCardWithJoi(card)
        if (error) return error.details[0].message;
        return false;
    }
}

module.exports = validateCard;