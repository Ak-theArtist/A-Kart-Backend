const express = require('express');
const router = express.Router();
const { verifyUser, isSuperAdmin } = require('../middlewares/authWares');
const {
    register,
    forgotPassword,
    verifyOTP,
    updatePassword,
    login,
    logout,
    addToCart,
    newcollections,
    popularinMen,
    popularinWomen,
    me,
    superAdmin,
    makeAdmin,
    adminInfo,
    revertAdmin,
    deleteUser,
    getAllusers,
    removefromCart,
    getUserCart,
    updateProfile,
    getUserDetails, 
    addAddress,
    deleteAddress,
    deletePincode,
    getUserAddresses,  
} = require('../controller/authCtrl');

router.get('/admin', (req, res, next) => {
    console.log('Admin route hit');
    next();
}, adminInfo);

router.post('/register', register);
router.post('/forgotpassword', forgotPassword);
router.post('/verifyotp', verifyOTP);
router.post('/updatepassword', updatePassword);
router.post('/login', login);
router.get('/logout', logout);
router.post('/addtocart/:id', addToCart);
router.post('/removefromcart/:userId', removefromCart);
router.get('/cart/:userId', getUserCart); 
router.get('/newcollections', newcollections);
router.get('/popularinmen', popularinMen);
router.get('/popularinwomen', popularinWomen);
router.get('/me', verifyUser, me);
router.get('/superadmin', verifyUser, isSuperAdmin, superAdmin);
router.get('/admin', adminInfo);
router.get('/admininfo', verifyUser, isSuperAdmin, adminInfo);
router.put('/makeAdmin/:id', makeAdmin);
router.put('/revertAdmin/:id', revertAdmin);
router.delete('/deleteUser/:id', deleteUser);
router.get('/getAllusers', verifyUser, getAllusers);
router.put('/updateProfile', updateProfile);
router.get('/userdetails/:id', getUserDetails);
router.put('/addAddress', addAddress);
router.delete('/deleteAddress', deleteAddress);
router.put('/updateAddress', addAddress);
router.delete('/deletePincode', deletePincode); 
router.get('/addresses/:userId', getUserAddresses);


module.exports = router;
