const Color = require('../models/color');
const validateId = require('../helpers/validateMongoId')
const asyncHandler = require('express-async-handler');

const colorControllers = {};



colorControllers.createColor = asyncHandler(async (req, res) => {
    try {
        const newColor = await Color.create(req.body);
        if (!newColor) {
            res.status(400).json({ message: "Color not created" })
        }
        res.status(200).json(newColor)

    } catch (err) {
        throw new Error(err.message)
    }
})
colorControllers.getColor = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        validateId(id);
        let color = await Color.findById(id);
        if (!color) {
            res.status(400).send("Color cant be fetched")
        }
        res.status(200).json(color);
    } catch (err) {
        throw new Error(err.message)
    }
})
colorControllers.getColors = asyncHandler(async (req, res) => {
    try {
        let colorList = await Color.find();
        if (!colorList) {
            res.status(400).send("colorlist cant be fetched")
        }
        res.status(200).json(colorList);
    } catch (err) {
        throw new Error(err.message)
    }
})
colorControllers.updateColors = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        validateId(id);
        let updatedColor = await Color.findByIdAndUpdate(id,req.body,{new:true});
        if (!updatedColor) {
            res.status(400).send("updatedColor cant be fetched")
        }
        res.status(200).json(updatedColor);
    } catch (err) {
        throw new Error(err.message)
    }
})
colorControllers.deleteColor = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        validateId(id);
        let deletedColor = await Color.findByIdAndRemove(id);
        if (!deletedColor) {
            res.status(400).send("deletedColor cant be fetched")
        }
        res.status(200).json({message:"Color Deleted Successfully ",deletedColor});
    }catch (err) {
        throw new Error(err.message)
    }
})

module.exports= colorControllers;