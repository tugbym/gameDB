var express = require('express'),
    router = express.Router(),
    Registration = require('../models/register-model');

/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('register');
});

router.post('/', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var firstname = req.body.first_name;
  var lastname = req.body.last_name;
  var dob = req.body.date_of_birth;
  var email = req.body.email_address;
  
  var newUser = Registration.addNewUser({
      username: username,
      password: password,
      name: { first: firstname, last: lastname },
      dob: dob,
      email: email            
  }, function(err, result) {
      if(err) {
          res.status(err.status || 500);
          return res.render('register', { result: err.message });
      } else {
          return res.render('register', { result: 'You have been successfully registered.' });
      }
  });
});

module.exports = router;