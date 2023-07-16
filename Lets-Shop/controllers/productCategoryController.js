const ProductCategory = require('../models/productCategory');
const asyncHandler = require('express-async-handler')
const validateId = require('../helpers/validateMongoId')

const ProductCategoryController = {};


ProductCategoryController.createProductCategory = asyncHandler(
    async (req, res) => {
        try {
            const Productcategory = await ProductCategory.create(req.body)
            if (!Productcategory) {
                res.status(400).send("ProductCategory can't be created")
            }
            res.status(200).json(Productcategory)
        } catch (err) {
            throw new Error(err)
        }
    }
)
ProductCategoryController.getProductCategory = asyncHandler(
    async (req, res) => {
        try {
            const {ProductcategoryId}=req.body;
            validateId(ProductcategoryId);
            const Productcategory = await ProductCategory.findById(ProductcategoryId)
            if (!Productcategory) {
                res.status(400).send("ProductCategory can't be created")
            }
            res.status(200).json(Productcategory)
        } catch (err) {
            throw new Error(err)
        }
    }
)
ProductCategoryController.getProductCategorys = asyncHandler(
    async (req, res) => {
        try {
            const ProductcategoryId= req.params.id;
            const Productcategory = await ProductCategory.find(req.body)
            if (!Productcategory) {
                res.status(400).send("ProductCategory can't be created")
            }
            res.status(200).json(Productcategory)
        } catch (err) {
            throw new Error(err)
        }
    }
)
ProductCategoryController.updateProductCategory = asyncHandler(
    async (req, res) => {
        try {
            const Productcategory = await ProductCategory.create(req.body)
            if (!Productcategory) {
                res.status(400).send("ProductCategory can't be created")
            }
            res.status(200).json(Productcategory)
        } catch (err) {
            throw new Error(err)
        }
    }
)
ProductCategoryController.deleteProductCategory = asyncHandler(
    async (req, res) => {
        try {
            const Productcategory = await ProductCategory.create(req.body)
            if (!Productcategory) {
                res.status(400).send("ProductCategory can't be created")
            }
            res.status(200).json(Productcategory)
        } catch (err) {
            throw new Error(err)
        }
    }
)




module.exports = ProductCategoryController;