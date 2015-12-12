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

module.exports.addGame = function(id, game, callback) {
    Profile.findOne({ 'userID': id }, function(err, user) {
        if(err) {
            return callback(err);
        } 
        if(!user) {
            return callback(null, null);
        }
        
        var gamesOwned = user.gamesOwned;
        
        if(gamesOwned.indexOf(game) !== -1) {
            return callback("You already have this game added.");
        }
        
        gamesOwned.push(game);
        
        console.log(gamesOwned);
        
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

module.exports.deleteGame = function(id, game, callback) {
    Profile.findOne({ 'userID': id }, function(err, user) {
        if(err) {
            return callback(err);
        }
        if(!user) {
            return callback(null, null);
        }
        
        var gamesOwned = user.gamesOwned,
            pos = gamesOwned.indexOf(game);
        
        if(pos === -1) {
            return callback("This game does not exist in your collection.");
        }
        
        gamesOwned.splice(pos, 1);
        
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