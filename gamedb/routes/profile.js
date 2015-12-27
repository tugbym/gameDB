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
        id = req.session.passport.user._id;
    
    if(game) {
        var console = req.body['selected-console'],
            gameToDelete = { title: game, console: console };
    
        Profile.deleteGame(id, gameToDelete, function(err, response) {
            if(err) {
                response = "There was a problem deleting this game from your list. Please try again later.";
                return res.render('profile', { response: response });
            }
            res.redirect('/profile');
        });
    } else {
        var achievementsCompleted = req.body['achievements-completed'],
            achievementsTotal = req.body['achievements-total'],
            currentProgress = req.body['current-progress'],
            toDo = req.body['to-do'],
            stars = req.body['your-rating'],
            review = req.body['your-review'],
            title = req.body['selected-game-to-edit'],
            console = req.body['selected-console-to-edit'],
            informationToAdd = { title: title,
                               console: console, 
                               achievements: { completed: achievementsCompleted, total: achievementsTotal }, 
                               currentProgress: currentProgress, 
                               toDo: toDo,
                               stars: stars,
                               review: review };
        
        Profile.editGameInfo(id, informationToAdd, function(err, response) {
            if(err) {
                //err handling
            }
            res.redirect('/profile');
        });
        
    }
});

module.exports = router;