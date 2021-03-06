var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    session = require('express-session'),
    flash = require('connect-flash'),
    index = require('./routes/index'),
    login = require('./routes/login'),
    logout = require('./routes/logout'),
    register = require('./routes/register'),
    profile = require('./routes/profile'),
    add_game = require('./routes/add_game'),
    Profile = require('./models/profile-model'),
    mongo_login = require('./mongo_login'),
    app = express();

if (app.get('env') === 'production') {
    mongoose.connect(mongo_login.getMongoLogin);
} else {
    mongoose.connect('mongodb://localhost/GameDB');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if(app.get('env') === 'development') {
    app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Pass session data through to the front end on each request
app.use(function(req, res, next) {
    if(req.session.passport !== undefined) {
        if(req.session.passport['user'] ) {
            var user = req.session.passport.user.username;
            Profile.getProfile(user, function(err, profile) {
                if(err) {
                    console.log("Error retrieving users profile.");
                }
                res.locals.session = req.session.passport.user;
                res.locals.session.profile = {};
                res.locals.session.profile.mutualFriends = profile.mutualFriends;
                res.locals.session.profile.sentRequests = profile.sentRequests;
                res.locals.session.profile.receivedRequests = profile.receivedRequests;
                next();
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

// Log form data
if (app.get('env') === 'development') {
    app.use(function (req, res, next) {
        console.log(req.body);
        next();
    });
}

app.use('/', index);
app.use('/login', login);
app.use('/logout', logout);
app.use('/register', register);
app.use('/profile', profile);
app.post('/profile/:username', profile);
app.use('/add_game', add_game);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    return res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  return res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;