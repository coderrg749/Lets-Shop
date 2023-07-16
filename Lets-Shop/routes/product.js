const Express = require('express')
const productController=require('../controllers/productController')
const router = Express.Router();
const{isAdmin,authMiddleware}=require('../middlewares/auth')


router.post('/create',productController.creatProduct)
router.get('/',productController.getProducts)
router.get('/:id',authMiddleware,isAdmin,productController.getProduct)
router.delete('/:id',authMiddleware,isAdmin,productController.deleteProduct)
router.put('/:id',authMiddleware,isAdmin,productController.updateProduct)






module.exports=router;