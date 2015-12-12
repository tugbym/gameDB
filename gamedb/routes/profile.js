var express = require('express'),
    router = express.Router(),
    Profile = require('../models/profile-model'),
    mongoose = require('mongoose');

/* GET register page. */
router.get('/', function(req, res, next) {
  if (!req.session.passport) {
      
     var err = new Error('You must be logged in to view this page.');
     err.status = 401;
     return next(err);
     
  } else {
      
      if(!req.session.passport['user']) {
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);
      }
      
      var id = req.session.passport.user._id,
          response;
      
      Profile.getGameList(id, function(err, profile) {
          if(err) {
              response = "There was a problem retrieving your game list. Please try again later.";
              return res.render('profile', { response: response });
          } else if(profile.gamesOwned.length === undefined || profile.gamesOwned.length === 0) {
              response = "It seems you have no games added. Why not try adding a game?";
              return res.render('profile', { response: response });
          } else {
              return res.render('profile', { gamesList: profile.gamesOwned });
          }
      });
  }
});

router.post('/', function(req, res, next) {
    var game = req.body['selected-game'],
        console = req.body['selected-console'],
        id = req.session.passport.user._id,
        gameToDelete = { title: game, console: console };
    
    Profile.deleteGame(id, gameToDelete, function(err, response) {
        if(err) {
            response = "There was a problem deleting this game from your list. Please try again later.";
            return res.render('profile', { response: response });
        }
        res.redirect('/profile');
    });
});

module.exports = router;