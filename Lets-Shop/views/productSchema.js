const Joi = require('joi');

const productSchema={};

productSchema.createProduct = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string(),
  brand: Joi.string().required(),
  quantity: Joi.number().required(),
  images: Joi.array().items(Joi.string()),
  color: Joi.string().required(),
  ratings: Joi.array().items(
    Joi.object({
      star: Joi.number(),
      postedby: Joi.string()
    })
  ),
  sold: Joi.number().default(0),
});


productSchema.updateProduct = Joi.object({
    title: Joi.string(),
    slug: Joi.string(),
    description: Joi.string(),
    price: Joi.number(),
    category: Joi.string(),
    brand: Joi.string(),
    quantity: Joi.number(),
    images: Joi.array().items(Joi.string()),
    color: Joi.string(),
    ratings: Joi.array().items(
      Joi.object({
        star: Joi.number(),
        postedby: Joi.string()
      })
    ),
    sold: Joi.number().default(0),
  });
  
module.exports = productSchema;
