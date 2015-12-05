var express = require('express');
var router = express.Router();
var Registration = require('../models/register-model');
var mongoose = require('mongoose');
var passport = require('passport');

/* GET register page. */
router.get('/', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;