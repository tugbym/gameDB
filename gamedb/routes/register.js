var express = require('express');
var router = express.Router();
var Registration = require('../models/register-model');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'GameDB' });
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
  }, function(result) {
      if()
      res.render('register', { title: 'GameDB' });
  });
    
})

module.exports = router;