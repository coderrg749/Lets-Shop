const Joi = require('joi');
const USerSchema={}

 USerSchema.registerSchema = Joi.object({
  firstname: Joi.string().min(2).max(50).required(),
  lastname: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().regex(/^\S+@\S+\.\S+$/).required(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
  password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/).required(),
  isAdmin:Joi.boolean(),
  role:Joi.string()
});

USerSchema.loginSchema = Joi.object({
  email: Joi.string().email().regex(/^\S+@\S+\.\S+$/).required(),
  password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/).required(),
});

module.exports =USerSchema;
