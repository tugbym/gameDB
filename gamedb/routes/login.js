var express = require('express');
var router = express.Router();
var Registration = require('../models/register-model');
var mongoose = require('mongoose');
var passport = require('passport');

/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/',
            passport.authenticate('local', { successRedirect: '/',
                                             failureRedirect: '/login',
                                             failureFlash: true,
                                             successFlash: 'You have successfully logged in!'})    
);

module.exports = router;