const Express = require('express');
const router = Express.Router();
const{isAdmin,authMiddleware}=require('../middlewares/auth');
const BlogCategoryController = require('../controllers/blogCategoryController')



router.get('/getall',BlogCategoryController.getBlogCategorys)
router.post('/',authMiddleware,isAdmin,BlogCategoryController.createBlogCategory)
router.get('/:id',authMiddleware,isAdmin,BlogCategoryController.getBlogCategory)
router.put('/update/:id',authMiddleware,isAdmin,BlogCategoryController.updateBlogCategory)
router.delete('/:id',authMiddleware,isAdmin,BlogCategoryController.deleteBlogCategory)






module.exports = router