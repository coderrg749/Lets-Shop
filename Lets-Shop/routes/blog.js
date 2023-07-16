const Express = require('express')
const blogControllers=require('../controllers/blogController')
const router = Express.Router();
const{isAdmin,authMiddleware}=require('../middlewares/auth')

router.get('/',blogControllers.getallBlogs)
router.get('/:id',blogControllers.singleBlog)
router.post('/create',authMiddleware,isAdmin,blogControllers.createBlog)
router.delete('/:id',authMiddleware,isAdmin,blogControllers.deleteBlog)
router.put('/update-blog/:id',authMiddleware,isAdmin,blogControllers.updateBlog)
router.put('/liked',authMiddleware,isAdmin,blogControllers.liketheBlog)
router.put('/dislike',authMiddleware,isAdmin,blogControllers.disliketheBlog)

 


module.exports = router;