var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Profile = require('./profile-model'),
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
        return callback(null, match);
    });
}

var User = mongoose.model('user', registrationSchema);

module.exports.addNewUser = function(user, callback) {
    
    User.findOne({ username: user.username }, function(err, userExists) {
        if(err) {
            return callback(err);
        }
        if(userExists) {
            var error = new Error('This user already exists.');
            error.status = 409;
            return callback(error);
        } else {
            var newUser = new User({
                username: user.username,
                password: user.password,
                name: user.name,
                dob: user.dob,
                email: user.email
            });
            newUser.save(function(err) {
                if(err) {
                    return callback(err);
                }
                Profile.addNewProfile(newUser._id, newUser.username, function(err) {
                    if(err) {
                        return callback(err);
                    }
                    return callback(null, "Successfully added one new user.");
                });
            });
        }
    });
};

module.exports.deleteUser = function(user, callback) {
    
    var error;
    
    User.findOne({ username: user.username }, function(err, userExists) {
        if(err) {
            return callback(err);
        }
        if(!userExists) {
            error = new Error('User could not be found.');
            error.status = 401;
            return callback(error);
        } else {
            userExists.validatePassword(user.password, userExists.password, function(err, match) {
                if(err) {
                    return callback(err);
                }
                if(!match) {
                    error = new Error('Incorrect password.');
                    error.status = 401;
                    return callback(error);
                }
                User.remove({ username: userExists.username }, function(err) {
                    if(err) {
                        return callback(err);
                    }
                    Profile.removeProfile(userExists.username, function(err) {
                        if(err) {
                            return callback(err);
                        }
                        callback(null, "Successfully deleted user: " + userExists.username);
                    });
                });
            });
        }
    });
};

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
        
        var error;
        
        if(err) {
            return callback(err);
        }
        if(!user) {
            error = new Error('Incorrect username.');
            error.status = 401;
            return callback(error);
        }
        
        user.validatePassword(password, user.password, function(err, match) {
            if(err) {
                return callback(err);
            }
            if(!match) {
                error = new Error('Incorrect password.');
                error.status = 401;
                return callback(error);
            }
            return callback(null, user);
        });
    });
  })
);