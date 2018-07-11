var express = require('express');
var router = express.Router();

/**
 * Controllers (route handlers).
 */
const indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', indexController.index);
router.get('/profile', indexController.profile);
router.get('/profile1', indexController.profile1);
router.get('/profile2', indexController.profile2);
router.get('/profile3', indexController.profile3);
router.get('/profileNew', indexController.profileNew);
router.get('/login', indexController.login);
router.get('/presentation', indexController.presentation);

module.exports = router;
