var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Profile = require('../models/profile-model');

var registrationSchema = new Schema({
    username: String,
    password: String,
    name: {
        first: String,
        last: String
    },
    dob: Date,
    email: String
});

var User = mongoose.model('registrationModel', registrationSchema);

module.exports.addNewUser = function(user, callback) {
    var user = new User({
        username: user.username,
        password: user.password,
        name: user.name,
        dob: user.dob,
        email: user.email
    });
    
    user.save(function(err, result) {
        if(err) {
            return callback(err);
        }
        
        Profile.addNewProfile(result._id, user.username, function(err, profile) {
            if(err) {
                return callback(err);
            }
            return callback(null, {
                response: "Successfully added one new user.",
                user: result
            });
        });
    });
}

passport.serializeUser(function(user, done) {
  done(null, {_id: user._id, name: user.name, username: user.username} );
});

passport.deserializeUser(function (user, done) {
    User.findById(user._id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(function(username, password, callback) {
    User.findOne({ username: username, password: password }, function(err, user) {
        if(err) {
            return callback(err);
        }
        if(!user) {
            return callback(null, false, { message: 'Incorrect username and/or password.' });
        }
        return callback(null, user);
    });
  })
);