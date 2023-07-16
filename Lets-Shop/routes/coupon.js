const Express = require('express')
const couponController=require('../controllers/couponController');
const router =Express.Router();
const{authMiddleware,isAdmin}=require('../middlewares/auth')



router.post("/", authMiddleware, isAdmin, couponController.createCoupon);
router.get("/", authMiddleware, isAdmin, couponController.getAllCoupons);
router.get("/:id", authMiddleware, isAdmin, couponController.getAllCoupons);
router.put("/:id", authMiddleware, isAdmin, couponController.updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, couponController.deleteCoupon);
module.exports=router;