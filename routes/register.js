var express = require('express'),
    router = express.Router(),
    Registration = require('../models/register-model');

/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('register');
});

router.post('/', function(req, res, next) {
    var username = req.body.username,
        password = req.body.password,
        firstname = req.body.first_name,
        lastname = req.body.last_name,
        dob = req.body.date_of_birth,
        email = req.body.email_address,
        errors = [],
        err;
    
    //Validation Checks
    if(username.length < 5 || username.length > 15) {
        err = new Error('Your username must be between 6 and 15 characters long.');
        errors.push(err);
    }
    if(password.length < 5 || password.length > 15) {
        err = new Error('Your password must be between 6 and 15 characters long.');
        errors.push(err);
    }
    if(firstname.length < 2 || firstname.length > 20) {
        err = new Error('Your first name must be between 2 and 20 characters long.');
        errors.push(err);
    }
    if(firstname.match(/\d+/g) !== null) {
        err = new Error('Your first name must not contain any numbers.');
        errors.push(err);
    }
    if(lastname.length < 2 || lastname.length > 20 ) {
        err = new Error('Your last name must be between 2 and 20 characters long.');
        errors.push(err);
    }
    if(lastname.match(/\d+/g) !== null) {
        err = new Error('Your last name must not contain any numbers.');
        errors.push(err);
    }
    if(Date.parse(dob) === NaN) {
        err = new Error('Invalid date.');
        errors.push(err);
    }
    if(email.length < 6 || email.length > 30) {
        err = new Error('Your email must be between 6 and 30 characters long.');
        errors.push(err);
    }
    if(email.match(/[a-zA-Z0-9._%+-]+[@]+[a-z0-9.-]+[.]+[a-z]{2,3}$/) === null) {
        err = new Error('Invalid email address.');
        errors.push(err);
    }
    
    //Return errors, if any
    if(errors[0]) {
        res.status(401);
        return res.render('register', { result: 'There are some errors with your registration details.', errors: errors });
    }
  
    var newUser = Registration.addNewUser({
        username: username,
        password: password,
        name: { first: firstname, last: lastname },
        dob: new Date(dob),
        email: email            
    }, function(error, result) {
        if(error) {
            res.status(error.status || 500);
            return res.render('register', { result: error.message });
        } else {
            return res.render('register', { result: 'You have been successfully registered.' });
        }
  });
});

module.exports = router;