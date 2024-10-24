const express = require('express');
const { googleLogin, createUser, loginUSer } = require('../controllers/Auth');
const router = express.Router();

router.post('/google-login',googleLogin);
router.post('/create',createUser)
router.post('/login',loginUSer)

module.exports =router