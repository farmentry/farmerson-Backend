const Joi = require("joi");
const cropSchema = Joi.object({
  cropName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Crop name is required.",
    "string.min": "Crop name must be at least 2 characters.",
    "string.max": "Crop name cannot exceed 50 characters.",
  }),

  cropVariety: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Crop variety is required.",
    "string.min": "Crop variety must be at least 2 characters.",
    "string.max": "Crop variety cannot exceed 50 characters.",
  }),

  sowingDate: Joi.date().iso().required().messages({
    "date.base": "Sowing date must be a valid date in YYYY-MM-DD format.",
    "any.required": "Sowing date is required.",
  }),

  estimatedHarvestDate: Joi.date()
    .iso()
    .greater(Joi.ref("sowingDate"))
    .required()
    .messages({
      "date.base":
        "Estimated harvest date must be a valid date in YYYY-MM-DD format.",
      "date.greater": "Estimated harvest date must be after the sowing date.",
      "any.required": "Estimated harvest date is required.",
    }),
  cultivationMethod: Joi.string()
    .valid("Organic", "Conventional")
    .required()
    .messages({
      "any.only":
        "Cultivation method must be either 'Organic' or 'Conventional'.",
      "any.required": "Cultivation method is required.",
    }),

  expectedYield: Joi.number().positive().required().messages({
    "number.base": "Expected yield must be a number.",
    "number.positive": "Expected yield must be a positive number.",
    "any.required": "Expected yield is required.",
  }),

  actualYield: Joi.number().positive().allow(null).messages({
    "number.base": "Actual yield must be a number.",
    "number.positive": "Actual yield must be a positive number.",
  }),
});

module.exports = { cropSchema };
