const Express = require('express')
const{isAdmin,authMiddleware}=require('../middlewares/auth');
const brandControllers = require('../controllers/brandController')
const router=Express.Router();


router.post("/", authMiddleware, isAdmin, brandControllers.createBrand);
router.put("/:id", authMiddleware, isAdmin, brandControllers.updateBrands);
router.delete("/:id", authMiddleware, isAdmin, brandControllers.deleteBrand);
router.get("/:id", brandControllers.getBrand);
router.get("/", brandControllers.getBrands);

module.exports = router;