var express = require('express'),
    router = express.Router(),
    Profile = require('../models/profile-model'),
    mongoose = require('mongoose');

router.get('/:username', function(req, res, next) {
    
    logInCheck(req.session.passport, next);
      
      var id = req.session.passport.user._id,
          username = req.session.passport.user.username,
          params = req.params.username,
          response;
      
      //Profile requested matches logged in user
      if(params === username) {
        Profile.getProfile(username, function(err, profile) {
          if(err) {
              response = "There was a problem retrieving your profile. Please try again later.";
              return res.render('profile', { params: username, response: response });
          } else if(profile.gamesOwned.length === undefined || profile.gamesOwned.length === 0) {
              response = "It seems you have no games added. Why not try adding a game?";
              return res.render('profile', { params: username, response: response, profile: profile });
          } else {
              return res.render('profile', { params: username, profile: profile });
          }
        });
          
      //Profile requested does not match logged in user
      } else {
        Profile.getProfile(params, function(err, profile) {
            
          if(err) {
              response = "There was a problem retrieving this users game list. Please try again later.";
              return res.render('profile', { params: params, response: response });
          } else if(!profile) {
              err = new Error('This user does not exist.');
              err.status = 404;
              return next(err);
          }
            
          var friendFlag = false,
              sentReqFlag = false,
              mutualFlag = false;

          if(profile.sentRequests.indexOf(username) !== -1) {
              friendFlag = true;
          }
          if(profile.receivedRequests.indexOf(username) !== -1) {
              sentReqFlag = true;
          }
          if(profile.mutualFriends.indexOf(username) !== -1) {
              mutualFlag = true;
          }
            
          if(profile.gamesOwned.length === undefined || profile.gamesOwned.length === 0) {                  
              response = "This user has no games added.";
              return res.render('profile', { params: params, response: response, profile: profile, friendFlag: friendFlag, sentReqFlag: sentReqFlag, mutualFlag: mutualFlag });
          } else {
              return res.render('profile', { params: params, profile: profile, friendFlag: friendFlag, sentReqFlag: sentReqFlag, mutualFlag: mutualFlag });
          }
            
        });
      }
  });

router.post('/:username', function(req, res, next) {
    
    logInCheck(req.session.passport, next);
    
    var game = req.body.selected_game,
        id = req.session.passport.user._id,
        username = req.session.passport.user.username;
    
    if(game) {
        var consoleToDelete = req.body.selected_console,
            gameToDelete = { title: game, console: consoleToDelete };
    
        Profile.deleteGame(id, gameToDelete, function(err, response) {
            if(err) {
                response = "There was a problem deleting this game from your list. Please try again later.";
                return res.render('profile', { params: username, response: response });
            }
            res.redirect('/profile/' + username);
        });
    } else {
        var achievementsCompleted = req.body.achievements_completed,
            achievementsTotal = req.body.achievements_total,
            currentProgress = req.body.current_progress,
            toDo = req.body.to_do,
            stars = req.body.your_rating,
            review = req.body.your_review,
            title = req.body.selected_game_to_edit,
            console = req.body.selected_console_to_edit,
            informationToAdd = { title: title,
                               console: console, 
                               achievements: { completed: achievementsCompleted, total: achievementsTotal }, 
                               currentProgress: currentProgress, 
                               toDo: toDo,
                               stars: stars,
                               review: review };
        
        Profile.editGameInfo(id, informationToAdd, function(err, response) {
            if(err) {
                res.render('profile', { params: username, response: err.message });
            } else {
                res.redirect('/profile/' + username);
            }
        });
        
    }
});

router.post('/:username/add_friend', function(req, res, next) {
    
    logInCheck(req.session.passport, next);
    
    var friend = req.params.username,
        username = req.session.passport.user.username;
    
    Profile.sendFriendRequest(username, friend, function(err, response) {
        if(err) {
            res.status(err.status);
            res.render('profile', { params: username, response: err.message });
        } else {
            res.redirect('/profile/' + friend);
        }
    });
    
});

router.post('/:username/accept_request', function(req, res, next) {
    
    logInCheck(req.session.passport, next);
    
    var friend = req.body.received_request,
        username = req.session.passport.user.username;
    
    if(!friend) {
        friend = req.params.username;
    }
    
    Profile.acceptFriendRequest(username, friend, function(err, response) {
        if(err) {
            res.status(err.status);
            res.render('profile', { params: username, response: err.message });
        } else {
            res.redirect('/profile/' + friend);
        }
    });
 
});

router.post('/:username/cancel_request', function(req, res, next) {
    
    logInCheck(req.session.passport, next);
    
    var friend,
        username = req.session.passport.user.username;
    
    if(req.body.sent_request) {
        friend = req.body.sent_request;
    } else {
        friend = req.params.username;
    }   
    
    Profile.cancelFriendRequest(username, friend, function(err, response) {
        if(err) {
            res.status(err.status);
            res.render('profile', { params: username, response: err.message });
        } else {
            res.redirect('/profile/' + friend);
        }
    });
    
});

router.post('/:username/decline_request', function(req, res, next) {
    
    logInCheck(req.session.passport, next);
    
    var friend,
        username = req.session.passport.user.username;
    
    if(req.body.received_request) {
        friend = req.body.received_request;
    } else {
        friend = req.params.username;
    }
    
    Profile.declineFriendRequest(username, friend, function(err, response) {
        if(err) {
            res.status(err.status);
            res.render('profile', { params: username, response: err.message });
        } else {
            res.redirect('/profile/' + friend);
        }
    });
    
});

router.post('/:username/remove_friend', function(req, res, next) {
    
    logInCheck(req.session.passport, next);
    
    var friend,
        username = req.session.passport.user.username;
    
    if(req.body.mutual_friend) {
        friend = req.body.mutual_friend;
    } else {
        friend = req.params.username;
    }
    
    Profile.removeFriend(username, friend, function(err, response) {
        if(err) {
            res.status(err.status);
            res.render('profile', { params: username, response: err.message });
        } else {
            res.redirect('/profile/' + friend);
        }
    
});
    });

function logInCheck(session, next) {
    
    var err;
    
    if (!session) {
        err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);
    }
    
    if(!session.user) {
        err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);
    }
    
}

module.exports = router;