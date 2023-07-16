const Product = require('../models/product')
const mongoose = require('mongoose')
const slugify = require('slugify')
const validateId = require('../helpers/validateMongoId')
const productSchema = require('../views/productSchema')
const asyncHandler = require('express-async-handler')
const User = require('../models/user')

const productController = {}

//CREATE A PRODUCT -------------------------->
productController.creatProduct = asyncHandler(async (req, res) => {
    try {
        let { err, value } = productSchema.createProduct.validate(req.body)
        if (err) {
            return res.status(400).json({ error: err.details[0].message })
        }
        if (value.title) {
            value.slug = slugify(value.title, { lower: true })
        }
        let product = await Product.create(value)
        if (product) {
            res.status(200).json({
                message: 'Product created Successfuly',
                product: product,
            })
        } else {
            res.status(400).send('Product cant be created')
        }
    } catch (err) {
        throw new Error(err)
    }
})

// //GET  PRODUCTS -------------------------->
// productController.getProducts = asyncHandler(async (req, res) => {
//     try {
//      //METHOD 1
//         // let query = req.query;
//         // let product = await Product.find(query);

//         //METHOD 2
//         // let product = await Product.find({
//         // brand:req.query.brand,
//         // category:req.query.category,
//         // });

//         //METHOD 3
//         // let product = await Product.Where('category).equals(req.query.category)

// //           const queryObj={...req.query}
// // console.log(queryObj,"this is obj",req.query )

// //         let products = await Product.find({});
// //         if (products.length !== 0) {
// //             res.status(200).json(products)
// //         } else {
// //             res.status(400).send("ProductList cant be fetched")
// //         }
// const { page = 1, limit = 10, sort = "-createdAt", fields } = req.query;

//   const skip = (page - 1) * limit;

//   const queryObj = { ...req.query };
//   const excludedFields = ["page", "limit", "sort", "fields"];
//   excludedFields.forEach((field) => delete queryObj[field]);

//   let query = Product.find(queryObj)
//     .sort(sort)
//     .skip(skip)
//     .limit(parseInt(limit))
//     .lean();
//     if (fields) {
//         const fieldArray = fields.split(",");
//         query = query.select(fieldArray.join(" "));
//       }
//   const productCount = await Product.countDocuments(queryObj);

//   if (skip >= productCount) {
//     throw new Error("This page does not exist");
//   }

//   const products = await query;

//   res.json({
//     success: true,
//     page,
//     limit,
//     totalProducts: productCount,
//     products,
//   });
//     } catch (err) {
//         throw new Error(err);
//     }
// })

//GET ALL PRODUCTS
productController.getProducts = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = '-createdAt', fields } = req.query

        const skip = (page - 1) * limit

        const queryObj = { ...req.query }
        const excludedFields = ['page', 'limit', 'sort', 'fields']
        excludedFields.forEach((field) => delete queryObj[field])

        let query = Product.find(queryObj)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .lean()
        if (fields) {
            const fieldArray = fields.split(',')
            query = query.select(fieldArray.join(' '))
        }
        const productCount = await Product.countDocuments(queryObj)

        if (skip >= productCount) {
            throw new Error('This page does not exist')
        }

        const products = await query

        res.json({
            success: true,
            page,
            limit,
            totalProducts: productCount,
            products,
        })
    } catch (err) {
        throw new Error(err)
    }
})

//GET A PRODUCT -------------------------->
productController.getProduct = asyncHandler(async (req, res) => {
    try {
        let id = req.params.id
        validateId(id)
        let Product = await Product.findById(id)
        if (Product) {
            res.status(200).json(Product)
        } else {
            res.status(400).send('Product cant be fetched')
        }
    } catch (err) {
        throw new Error(err)
    }
})

//UPDATE A PRODUCT -------------------------->
productController.updateProduct = asyncHandler(async (req, res) => {
    try {
        let { err, value } = productSchema.updateProduct.validate(req.body)
        if (err) {
            return res.status(400).json({ error: err.details[0].message })
        }
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        let id = req.params.id
        validateId(id)
        let product = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
        })
        if (product) {
            res.status(200).json(product)
        } else {
            res.status(400).send('Product cant be fetched')
        }
    } catch (err) {
        throw new Error(err)
    }
})

//DELETE A PRODUCT -------------------------->
productController.deleteProduct = asyncHandler(async (req, res) => {
    try {
        let id = req.params.id
        validateId(id)
        let deletedproduct = await Product.findOneAndDelete(id)
        if (deletedproduct) {
            res.status(200).json({
                message: 'product deleted',
                deletedproduct: deletedproduct,
            })
        } else {
            res.status(400).send('Product cant be fetched')
        }
    } catch (err) {
        throw new Error(err)
    }
})

//RATING 
productController.rating = asyncHandler(async (req, res) => {
    try {
        let { _id } = req.user
        validateId(_id)
        let { star, prodId, comment } = req.body
        validateId(prodId)

        let product = await Product.findById(prodId)

        if (product) {
            let alreadyRated = product?.ratings.find(
                (id) => id.toString() === _id.toString()
            )
            if (alreadyRated) {
                let updatedRating = await product.findByIdAndUpdate(
                    prodId,
                    {
                        ratings: { $eleMatch: alreadyRated },
                    },
                    {
                        $set: {
                            'ratings.$.star': star,
                            'ratings.$.comment': comment,
                        },
                    },
                    { new: true }
                )
            } else {
                const rating = await product.findByIdAndUpdate(
                    prodId,
                    {
                        $push: {
                            ratings: {
                                star: star,
                                postedby: _id,
                                comment: comment,
                            },
                        },
                    },
                    { new: true }
                )
            }
            const productInfo = await Product.findById(prodId)
            let totalNumberOfRatings = productInfo?.ratings.length
            let totalStars = productInfo
                .ratings((item) => item.star)
                .reduce((prev, curr) => prev + curr, 0)
            let averageRating = Math.round(totalStars / totalNumberOfRatings)
            let finalProduce = await Product.findByIdAndUpdate(
                prodId,
                {
                    totalrating: totalStars,
                },
                {
                    averagerating: averageRating,
                },
                { new: true }
            )
            res.json(finalProduce)
        } else {
            res.status(400).send('No product exists with the given id')
        }
    } catch (Err) {
        throw new Error(Err)
    }
})

module.exports = productController
