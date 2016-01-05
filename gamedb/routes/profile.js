var express = require('express'),
    router = express.Router(),
    Profile = require('../models/profile-model'),
    mongoose = require('mongoose');

router.get('/:id', function(req, res, next) {
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
      
      //Profile requested matches logged in user
      if(req.params.id === id) {
        Profile.getGameList(id, function(err, profile) {
          if(err) {
              response = "There was a problem retrieving your game list. Please try again later.";
              return res.render('profile', { params: id, response: response });
          } else if(profile.gamesOwned.length === undefined || profile.gamesOwned.length === 0) {
              response = "It seems you have no games added. Why not try adding a game?";
              return res.render('profile', { params: id, response: response });
          } else {
              return res.render('profile', { params: id, gamesList: profile.gamesOwned });
          }
        });
          
      //Profile requested does not match logged in user
      } else {
        Profile.getGameList(req.params.id, function(err, profile) {
          if(err) {
              response = "There was a problem retrieving this users game list. Please try again later.";
              return res.render('profile', { params: req.params.id, response: response });
          } else if(profile.gamesOwned.length === undefined || profile.gamesOwned.length === 0) {
              response = "This user has no games added.";
              return res.render('profile', { params: req.params.id, response: response });
          } else {
              return res.render('profile', { params: req.params.id, gamesList: profile.gamesOwned });
          }
        });
      }
      
  }
});

router.post('/:id', function(req, res, next) {
    
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
            res.redirect('/profile/' + id);
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
                console.log(err);
            }
            res.redirect('/profile/' + id);
        });
        
    }
});

module.exports = router;