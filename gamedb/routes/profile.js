var express = require('express'),
    router = express.Router(),
    Profile = require('../models/profile-model'),
    mongoose = require('mongoose');

/* GET register page. */
router.get('/', function(req, res, next) {
  if (!req.session.passport) {
      
     var err = new Error('You must be logged in to view this page.');
     err.status = 401;
     next(err);
     
  } else {
      
      if(!req.session.passport['user']) {
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        next(err);
      }
      
      var id = req.session.passport.user._id,
          response;
      Profile.getGameList(id, function(err, user) {
          if(err) {
              response = "There was a problem retrieving your game list. Please try again later.";
          } else if(!user) {
              response = "It seems you have no games added. Why not try adding a game?";
          }
          res.render('profile', { response: response });
      });
  }
});

module.exports = router;