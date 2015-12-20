var express = require('express');
var router = express.Router();
var Registration = require('../models/register-model');
var mongoose = require('mongoose');
var passport = require('passport');

/* GET register page. */
router.get('/', function(req, res, next) {
    var err = req.flash().error;
    res.render('login', { error: err });
});

router.post('/',
            passport.authenticate('local', { successRedirect: '/profile',
                                             failureRedirect: '/login',
                                             failureFlash: true})
);

module.exports = router;