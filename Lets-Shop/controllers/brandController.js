const brand = require('../models/brand');
const Brand = require('../models/brand');
const validateId = require('../helpers/validateMongoId')
const asyncHandler = require('express-async-handler');

const brandControllers = {};



brandControllers.createBrand = asyncHandler(async (req, res) => {
    try {
        const brand = await Brand.create(req.body);
        if (!brand) {
            res.status(400).json({ message: "Brand not created" })
        }
        res.status(200).json(brand)

    } catch (err) {
        throw new Error(err.message)
    }
})
brandControllers.getBrand = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        validateId(id);
        let brand = await Brand.findById(id);
        if (!brand) {
            res.status(400).send("brand cant be fetched")
        }
        res.status(200).json(brand);
    } catch (err) {
        throw new Error(err.message)
    }
})
brandControllers.getBrands = asyncHandler(async (req, res) => {
    try {
        let brandList = await Brand.find();
        if (!brandList) {
            res.status(400).send("Brandlist cant be fetched")
        }
        res.status(200).json(brandList);
    } catch (err) {
        throw new Error(err.message)
    }
})
brandControllers.updateBrands = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        validateId(id);
        let updatedBrand = await Brand.findByIdAndUpdate(id,req.body,{new:true});
        if (!updatedBrand) {
            res.status(400).send("updatedBrand cant be fetched")
        }
        res.status(200).json(updatedBrand);
    } catch (err) {
        throw new Error(err.message)
    }
})
brandControllers.deleteBrand = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        validateId(id);
        let deletedBrand = await Brand.findByIdAndRemove(id);
        if (!deletedBrand) {
            res.status(400).send("deletedBrand cant be fetched")
        }
        res.status(200).json({message:"Brand Deleted Successfully ",deletedBrand});
    }catch (err) {
        throw new Error(err.message)
    }
})

module.exports= brandControllers;