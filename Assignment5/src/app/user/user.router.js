// user.router.js
const express = require('express');
const router = express.Router();
const userController = require('../user/user.controler.js'); // تأكد من التصدير الفعلي في ذلك الملف

router.post('/sign-up', userController.createUser);
router.put('/:id', userController.updateUser);
router.get('/:id', userController.getUserById);
router.get('/by-email/:email', userController.getUserByEmail);

module.exports = router;