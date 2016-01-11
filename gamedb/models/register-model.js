var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Profile = require('../models/profile-model'),
    bcrypt = require('bcrypt');

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

registrationSchema.pre('save', function(next) {
    var user = this;
    
    bcrypt.genSalt(10, function(err, salt) {
        if(err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

registrationSchema.methods.validatePassword = function(password, userPassword, callback) {
    bcrypt.compare(password, userPassword, function(err, match) {
        if(err) {
            return callback(err);
        }
        callback(null, match);
    });
}

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
    User.findOne({ username: username }, function(err, user) {
        
        if(err) {
            return callback(err);
        }
        if(!user) {
            return callback(null, false, { message: 'Incorrect username.' });
        }
        
        user.validatePassword(password, user.password, function(err, match) {
            if(err) {
                return callback(err);
            }
            if(!match) {
                return callback(null, false, { message: 'Incorrect password.' });
            }
            return callback(null, user);
        });
    });
  })
);