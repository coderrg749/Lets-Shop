const asyncHandler = require('express-async-handler')
const Coupon = require('../models/coupon')
const validateId = require('../helpers/validateMongoId')
const generateCouponCode = require('../helpers/coupon')

const couponController = {}
//crate
couponController.createCoupon = asyncHandler(async (req, res) => {
    try {
        const coupo = await Coupon.create(req.body)
        if (!coupo) {
            res.status(400).send("Coupon can't be generated")
        }
        res.status(200).json(coupo)
    } catch (err) {
        throw new Error(err)
    }
})
couponController.updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const updatecoupon = await Coupon.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatecoupon) {
        res.status(400).send("Coupon can't be generated")
    }
      res.json(updatecoupon);
    } catch (error) {
      throw new Error(error);
    }
  });
  couponController.deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const deletecoupon = await Coupon.findByIdAndDelete(id);
      res.json(deletecoupon);
    } catch (error) {
      throw new Error(error);
    }
  });
  couponController.getCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const getAcoupon = await Coupon.findById(id);
      res.json(getAcoupon);
    } catch (error) {
      throw new Error(error);
    }
  });
  couponController.getAllCoupons = asyncHandler(async (req, res) => {
    try {
      const getCoupolist = await Coupon.find();
      if(getCoupolist.length>0){
          res.json(getAcoupon);
      }else{
        res.status(400).send("coupon can't be fethed")
      }
    } catch (error) {
      throw new Error(error);
    }
  });
  module.exports=couponController;