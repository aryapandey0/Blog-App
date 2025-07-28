const express=require('express');
const { register, login, getAllUsers, deleteUser } = require('../controller/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const router = express.Router();
const {roleMiddleware, allowRoles} = require("../middleware/roleMiddleware")

router.post("/register",upload.single("image"),register)
router.post("/login",login)
router.get("/users", protect, allowRoles('ADMIN'), getAllUsers);
router.delete("/delete/:id",protect,allowRoles("ADMIN"),deleteUser);
module.exports = router;