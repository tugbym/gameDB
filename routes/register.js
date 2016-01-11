var express = require('express');
var router = express.Router();
var Registration = require('../models/register-model');
var mongoose = require('mongoose');

/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('register');
});

router.post('/', function(req, res, next) {
  var username = req.body['username'];
  var password = req.body['password'];
  var firstname = req.body['first-name'];
  var lastname = req.body['last-name'];
  var dob = req.body['date-of-birth'];
  var email = req.body['email-address'];
  
  var newUser = Registration.addNewUser({
      username: username,
      password: password,
      name: { first: firstname, last: lastname },
      dob: dob,
      email: email            
  }, function(err, result) {
      if(err) {
          res.render('register', { result: 'There was an error submitting your registration. Please try again later.'});
      } else {
          res.render('register', { result: 'You have been successfully registered.' });
      }
  });
    
})

module.exports = router;