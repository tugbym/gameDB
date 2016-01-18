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

function isAlreadyLoggedIn(req, res, next) {
  if (req.session.passport) {
      if(req.session.passport.user) {
          res.status(403);
          return res.render('login', { error: 'You are already logged in.' });
      } else {
          next();
      }
  } else {
      next();
  }
}

router.post('/', isAlreadyLoggedIn, passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }));

module.exports = router;