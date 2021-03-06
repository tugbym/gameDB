var express = require('express'),
    router = express.Router(),
    Profile = require('../models/profile-model'),
    mongoose = require('mongoose'),
    api = require('../api_key'),
    request = require('request');

/* GET register page. */
router.get('/', function(req, res, next) {
  if (!req.session.passport) {
      
     var err = new Error('You must be logged in to view this page.');
     err.status = 401;
     return next(err);
     
  } else {
      
      if(!req.session.passport.user) {
        var error = new Error('You must be logged in to view this page.');
        error.status = 401;
        return next(error);
      }
      
      res.render('add_game');
      
  }
});

router.post('/', function(req, res, next) {
    
    if (!req.session.passport) {
      
       var err = new Error('You must be logged in to view this page.');
       err.status = 401;
       return next(err);
     
    } else {
      
        if(!req.session.passport.user) {
            var error = new Error('You must be logged in to view this page.');
            error.status = 401;
            return next(error);
        }
      
        //Search form submitted
        if(req.body.search_query !== undefined) {
          
          var query = req.body.search_query;
          var searchBy = req.body.search_by;
      
          query = query.replace(/ /g, '%20');
      
          var api_key = api.getApiKey;
          var url = "http://www.giantbomb.com/api/search/?api_key=" + api_key + "&format=json&query=" + query + "&resources=" + searchBy;
      
          request(url, function(err, response, body) {
            if(err) {
                return res.render('add_game', { message: err });
            }
            if(!err && response.statusCode === 200) {
              
              body = JSON.parse(body);
              
              var game,
                  platforms,
                  results = {};
                
              body.results.forEach(function(result, i) {
                  game = result.name;
                  platforms = result.platforms;
                  if(game && platforms) {
                      results[i] = { title: game, platforms: platforms };
                  }
              });
                
              return res.render('add_game', { results: results });
           }
        });
            
      //Add Game form submitted
      } else {
          var game = req.body.selected_game,
              console = req.body.selected_console,
              id = req.session.passport.user._id,
              newGame = { title: game,
                          console: console, 
                          achievements: { completed: '', total: '' }, 
                          currentProgress: '', 
                          toDo: '',
                          stars: '',
                          review: '' };
          
          Profile.addGame(id, newGame, function(err, response) {
              if(err) {
                  res.status(err.status || 500);
                  return res.render('add_game', { message: err.message } );
              }
              res.render('add_game', { message: 'Successfully added: ' + game });
          });
      }
  }
});

module.exports = router;