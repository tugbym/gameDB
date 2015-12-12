var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var profileSchema = new Schema({
    userID: String,
    username: String,
    gamesOwned: [],
    gamesWanted: []
});

var Profile = mongoose.model('profileModel', profileSchema);

module.exports.addNewProfile = function(id, username, callback) {
    var profile = new Profile({
        userID: id,
        username: username,
        gamesOwned: [],
        gamesWanted: []
    });
    
    profile.save(function(err, profile) {
        if(err) {
            return callback(err);
        }
        return callback(null, {
            message: 'Successfully added new user profile.',
            profile: profile
        });
    });
}

module.exports.getGameList = function(id, callback) {
    Profile.findOne({ 'userID': id }, function(err, profile) {
        if(err) {
            return callback(err);
        }
        if(!profile) {
            return callback(null, null);
        }
        return callback(null, profile);
    });
}

module.exports.addGame = function(id, newGame, callback) {
    Profile.findOne({ 'userID': id }, function(err, user) {
        if(err) {
            return callback(err);
        } 
        if(!user) {
            return callback();
        }
        
        var gamesOwned = user.gamesOwned;
        
        gamesOwned.forEach(function(gameOwned) {
            if(gameOwned.title === newGame.title && gameOwned.console === newGame.console) {
                return callback("You already have this game added.");
            }
        });
        
        gamesOwned.push(newGame);
        
        Profile.update({ 'userID': id }, { 'gamesOwned': gamesOwned }, function(err, update) {
            if(err) {
                return callback(err);
            }
            return callback(null, {
                response: 'Successfully added game.'
            });
        });
        
    });
}

module.exports.deleteGame = function(id, gameToDelete, callback) {
    Profile.findOne({ 'userID': id }, function(err, user) {
        if(err) {
            return callback(err);
        }
        if(!user) {
            return callback(null, null);
        }
        
        var gamesOwned = user.gamesOwned;
        
        gamesOwned.forEach(function(gameOwned, index) {
            if(gameOwned.title === gameToDelete.title && gameOwned.console === gameToDelete.console) {
                gamesOwned.splice(index, 1);
            }
        });
        
        Profile.update({ 'userID': id }, { 'gamesOwned': gamesOwned }, function(err, update) {
            if(err) {
                return callback(err);
            }
            return callback(null, {
                response: 'Successfully deleted game.'
            });
        }); 
    });
}