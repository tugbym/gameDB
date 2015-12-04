var express = require('express');
var router = express.Router();
var Registration = require('../models/register-model');
var mongoose = require('mongoose');

/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'GameDB' });
});

router.post('/', function(req, res, next) {
  var username = req.body['username'];
  var password = req.body['password'];
    
  var user = Registration.findUser({
      username: username,
      password: password
  }, function(err, user) {
      if(err) {
          res.render('login', { title: 'GameDB', result: 'There was a problem submitting the login form. Please try again later'});
      } else if(!user) {
          res.render('login', { title: 'GameDB', result: 'Incorrect username and/or password. '});
      } else {
          res.render('login', { title: 'GameDB', result: 'You have been successfully logged in.', name: user.name.first});
      }
  });
    
});

module.exports = router;