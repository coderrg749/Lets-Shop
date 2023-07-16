const BlogCategory = require('../models/blogCategory');
const asyncHandler = require('express-async-handler')
const validateId = require('../helpers/validateMongoId')

const BlogCategoryController = {};


BlogCategoryController.createBlogCategory = asyncHandler(
    async (req, res) => {
        try {
            const Blogcategory = await BlogCategory.create(req.body)
            if (!Blogcategory) {
                res.status(400).send("BlogCategory can't be created")
            }
            res.status(200).json(Blogcategory)
        } catch (err) {
            throw new Error(err)
        }
    }
)
BlogCategoryController.getBlogCategory = asyncHandler(
    async (req, res) => {
        try {
            const id  = req.params.id;
            validateId(id);
            const Blogcategory = await BlogCategory.findById(id)
            if (!Blogcategory) {
                res.status(400).send("BlogCategory can't be created")
            }
            res.status(200).json(Blogcategory)
        } catch (err) {
            throw new Error(err)
        }
    }
)
BlogCategoryController.getBlogCategorys = asyncHandler(
    async (req, res) => {
        try {
            const Blogcategory = await BlogCategory.find()
            if (!Blogcategory) {
                res.status(400).send("BlogCategory can't be created")
            }
            res.status(200).json(Blogcategory)
        } catch (err) {
            throw new Error(err)
        }
    }
)
BlogCategoryController.updateBlogCategory = asyncHandler(
    async (req, res) => {
        try {
            const  _id  = req.params.id;
            console.log(req.params.id)
            validateId(_id);
            const Blogcategory = await BlogCategory.findByIdAndUpdate(_id,req.body,{new:true})
            if (!Blogcategory) {
                res.status(400).send("BlogCategory can't be created")
            }
            res.status(200).json(Blogcategory)
        } catch (err) {
            throw new Error(err)
        } 
    }
)

BlogCategoryController.deleteBlogCategory = asyncHandler(
    async (req, res) => {
        try {
            const Blogcategory = await BlogCategory.create(req.body)
            if (!Blogcategory) {
                res.status(400).send("BlogCategory can't be created")
            }
            res.status(200).json(Blogcategory)
        } catch (err) {
            throw new Error(err)
        }
    }
)




module.exports = BlogCategoryController;