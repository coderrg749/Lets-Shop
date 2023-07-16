const Express = require('express')
const{isAdmin,authMiddleware}=require('../middlewares/auth');
const colorControllers = require('../controllers/colorController')
const router=Express.Router();


router.post("/", authMiddleware, isAdmin, colorControllers.createColor);
router.put("/:id", authMiddleware, isAdmin, colorControllers.updateColors);
router.delete("/:id", authMiddleware, isAdmin, colorControllers.deleteColor);
router.get("/:id", colorControllers.getColor);
router.get("/", colorControllers.getColor);

module.exports = router;