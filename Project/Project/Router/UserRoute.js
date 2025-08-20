const express = require('express');
const { getAllUsers, getUserById,createStaff, updateUser, deleteUser, getMe,forgetPassword,resetPassword } = require('../Controller/UserController');
const { protect, restrictTo,signUp,login} = require('../Controller/AuthController');
const router = express.Router();

router.post('/forgotPassword', forgetPassword);
router.patch('/resetPassword/:token', resetPassword);

router.get('/getMe', protect, getMe);

router.post('/signup', signUp);             
router.post('/login', login); 

router.post('/create-staff', protect, restrictTo("admin"), createStaff);
router.get('/', protect, restrictTo("admin"), getAllUsers);

router.get('/:id', protect,getUserById);
router.patch('/:id', protect,updateUser);
router.delete('/:id', protect, restrictTo("admin"), deleteUser);


module.exports = router;
