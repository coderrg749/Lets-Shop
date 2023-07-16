const Express = require('express');
const UserController= require('../controllers/userController')
const {isAdmin,authMiddleware} =require('../middlewares/auth')
const router = Express.Router();



router.post(`/register`,UserController.createUser) ;
router.post(`/login`,UserController.login) ;
router.get('/refresh',UserController.handleRefreshToken)
router.get(`/logout`,UserController.logout) ;
router.get(`/all-users`,UserController.allUsers) ;
router.post('/forgotPassword',UserController.forgotPasswordToken)



// ADMIN related
router.get(`/:id`,authMiddleware,isAdmin,UserController.singleUser) ;
router.delete(`/:id`,authMiddleware,isAdmin,UserController.deleteUser) ;
router.put('/block-user/:id',authMiddleware,isAdmin,UserController.blockUser)
router.put('/unblock-user/:id',authMiddleware,isAdmin,UserController.unblockUser)
router.put('/edit-user/:id',authMiddleware,isAdmin,UserController.updateUser)
router.put('/password',authMiddleware,UserController.updatePassword)
module.exports = router;
