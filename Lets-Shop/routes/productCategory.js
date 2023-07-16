const Express = require('express');
const router = Express.Router();
const{isAdmin,authMiddleware}=require('../middlewares/auth');
const ProductCategoryController = require('../controllers/productCategoryController')



router.post('/',authMiddleware,isAdmin,ProductCategoryController.createProductCategory)
router.put('/:id',authMiddleware,isAdmin,ProductCategoryController.updateProductCategory)
router.delete('/:id',authMiddleware,isAdmin,ProductCategoryController.deleteProductCategory)
router.get('/:id',ProductCategoryController.getProductCategory)
router.get('/',ProductCategoryController.getProductCategorys)






module.exports = router