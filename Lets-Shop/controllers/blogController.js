const Blog = require('../models/blog')
const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const validateId = require('../helpers/validateMongoId')

const blogControllers = {}

// CREATE BLOG
blogControllers.createBlog = asyncHandler(async (req, res) => {
    try {
        const blog = await Blog.create(req.body);
        if (!blog) {
            throw new Error("Blog cant be created ")
        }
        res.status(200).json(blog);
    } catch (err) {
        throw new Error("Internal Error")
    }
})

// GET SINGLE BLOG
blogControllers.singleBlog = asyncHandler(async (req, res) => {
    try {
        let blogId = req.params.id;
        validateId(blogId)
        const singleBlog = await Blog.findByIdAndUpdate({ _id: blogId }, { $inc: { numViews: 1 } }, { new: true }).populate('likes').populate('dislikes');
        if (!singleBlog) {
            res.status(400).send("Enter a valid Id")
        }
        res.status(200).json(singleBlog);
    } catch (err) {
        throw new Error("Internal err")
    }
})
// GET ALL BLOGS
blogControllers.getallBlogs = asyncHandler(async (req, res) => {
    try {
        const blogList = await Blog.find();
        if (!blogList) {
            res.status(400).send("Enter a valid Id")
        }
        res.status(200).json(blogList);
    } catch (err) {
        throw new Error("Internal err")
    }
})

// DELETE BLOG
blogControllers.deleteBlog = asyncHandler(async (req, res) => {
    try {
        let blogId = req.params.id;
        validateId(blogId);

        const deletedBlog = await Blog.findByIdAndRemove({ _id: blogId });
        if (!deletedBlog) {
            res.status(400).send("Enter a valid Id")
        }
        res.status(200).json({ message: "Blog deleted Successfully" });
    } catch (err) {
        throw new Error("Internal err")
    }
})

// UPDATE BLOG
blogControllers.updateBlog = asyncHandler(async (req, res) => {
    try {
        let blogId = req.params.id;
        validateId(blogId)
        const updatedBlog = await Blog.findByIdAndUpdate({ _id: blogId }, req.body, { new: true });
        if (!updatedBlog) {
            res.status(400).send("Blog cant be updated")
        }
        res.status(200).json(updatedBlog);
    } catch (err) {
        throw new Error("Internal err")
    }
})

// LIKE THE BLOG
blogControllers.liketheBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateId(blogId);
    const blog = await Blog.findById(blogId);
    const loginUserId = req?.user?._id;
    const isLiked = blog?.isLiked;
    const alreadyDisliked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserId },
                isDisliked: false,
            },
            { new: true }
        );
        res.json(blog);
    }
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId },
                isLiked: false,
            },
            { new: true }
        );
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { likes: loginUserId },
                isLiked: true,
            },
            { new: true }
        );
        res.json(blog);
    }
});
// DISLIKE THE BLOG 
blogControllers.disliketheBlog = asyncHandler(async (req, res) => {
    let { blogId } = req.body;
    validateId(blogId);
    let loginUserID = req.user?._id;
    const blog = await Blog.findById(blogId);
    const isDisliked = blog?.isDisliked;
    const alreadyLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserID?.toString()
    );
    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserID },
                isLiked: false,
            },
            { new: true }
        );
       return res.status(200).json(blog)
    }
    if (isDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            { $pull: { dislikes: loginUserID }, isLiked: false },
            { new: true }
        )
      return res.status(200).json(blog)
    }
     else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            { $push: { dislikes: loginUserID }, isDisliked: true },
            { new: true });
         return res.status(200).json(blog)
        }
})





module.exports = blogControllers;
