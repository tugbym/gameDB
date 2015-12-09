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
     next(err);
     
  } else {
      
      if(!req.session.passport['user']) {
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        next(err);
      }
      
      res.render('add_game');
      
  }
});

router.post('/', function(req, res, next) {
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
      
      var query = req.body['search-query'];
      var searchBy = req.body['search-by'];
      
      query = query.replace(/ /g, '%20');
      
      var api_key = api.getApiKey;
      var url = "http://www.giantbomb.com/api/search/?api_key=" + api_key + "&format=json&query=" + query + "&resources=" + searchBy;
      
      request(url, function(err, response, body) {
          if(err) {
              res.render('add_game', { error: "There was a problem getting the game data. Please try again later."});
          }
          if(!err && response.statusCode === 200) {
              
              body = JSON.parse(body);
              
              var noOfResults = body['number_of_total_results'],
                  game,
                  id,
                  results = {};
                  
              for(var i = 0; i<noOfResults; i++) {
                  game = body['results'][i]['name'];
                  id = body['results'][i]['id'];
                  results[i] = { title: game, id: id };
              }
              
          }
      });
      
  }
});

module.exports = router;