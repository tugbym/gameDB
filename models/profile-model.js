var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var profileSchema = new Schema({
    userID: String,
    username: String,
    gamesOwned: [],
    gamesWanted: [],
    mutualFriends: [],
    sentRequests: [],
    receivedRequests: []
});

var Profile = mongoose.model('profile', profileSchema);

module.exports.addNewProfile = function(id, username, callback) {
    var profile = new Profile({
        userID: id,
        username: username,
        gamesOwned: [],
        gamesWanted: [],
        mutualFriends: [],
        sentRequests: [],
        receivedRequests: []
    });
    
    profile.save(function(err) {
        if(err) {
            return callback(err);
        }
        return callback(null, 'Successfully added new user profile.');
    });
}

module.exports.removeProfile = function(username, callback) {
    Profile.remove({ 'username': username }, function(err) {
        if(err) {
            return callback(err);
        }
        return callback(null, 'Successfully deleted user profile.');
    });
}

module.exports.getProfile = function(username, callback) {
    Profile.findOne({ 'username': username }, function(err, profile) {
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
        
        var gamesOwned = user.gamesOwned,
            error;
        
        gamesOwned.forEach(function(gameOwned) {
            if(gameOwned.title === newGame.title && gameOwned.console === newGame.console) {
                error = new Error;
                error.message = "You already have this game added.";
                error.status = 409;
            }
        });
        
        if(error) {
            return callback(error);
        }
        
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
            return callback();
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

module.exports.editGameInfo = function(id, gameInfo, callback) {
    Profile.findOne({ 'userID': id }, function(err, user) {
        if(err) {
            return callback(err);
        }
        if(!user) {
            return callback();
        }
        
        var gamesOwned = user.gamesOwned;
        
        gamesOwned.forEach(function(gameOwned, index) {
            if(gameOwned.title === gameInfo.title && gameOwned.console === gameInfo.console) {
                gamesOwned[index] = gameInfo;
            }
        });
        
        Profile.update({ 'userID': id }, { 'gamesOwned': gamesOwned }, function(err, update) {
            if(err) {
                return callback(err);
            }
            return callback(null, {
                response: 'Successfully edited game info'
            });
        });        
    });
}

module.exports.sendFriendRequest = function(username, friend, callback) {
    
    //Update our sent requests array
    Profile.findOne({ 'username': username }, function(err, user) {
        if(err) {
            return callback(err);
        }
        if(!user) {
            return callback();
        }
        
        var sentRequests = user.sentRequests;
        sentRequests.push(friend);
        
        Profile.update({ 'username': username }, { 'sentRequests': sentRequests }, function(err, update) {
            if(err) {
                return callback(err);
            }
        });
    });
    
    //Update our friends received requests array
    Profile.findOne({ 'username': friend }, function(err, user) {
        if(err) {
            return callback(err);
        }
        if(!user) {
            return callback();
        }
        
        var receivedRequests = user.receivedRequests;
        receivedRequests.push(username);
        
        Profile.update({ 'username': friend }, { 'receivedRequests': receivedRequests }, function(err, update) {
            if(err) {
                return callback(err);
            }
        });
    });
    
    //Send the callback
    return callback(null, {
        response: 'Successfully sent friend request from ' + username + ' to ' + friend
    });
}

module.exports.acceptFriendRequest = function(username, friend, callback) {
    
    //Delete friend from sent or received requests array
    Profile.findOne({ 'username': username }, function(err, user) {
        if(err) {
            return callback(err);
        }
        if(!user) {
            return callback();
        }
        
        var pos1 = user.receivedRequests.indexOf(friend),
            pos2 = user.sentRequests.indexOf(friend);
        
        if(pos1 != -1) {
            user.receivedRequests.splice(pos1, 1);
        }
        if(pos2 != -1) {
            user.sentRequests.splice(pos2, 1);
        }
        user.mutualFriends.push(friend);
        
        Profile.update({ 'username': username }, { 'receivedRequests': user.receivedRequests, 'sentRequests': user.sentRequests, 'mutualFriends': user.mutualFriends }, function(err, update) {
            if(err) {
                return callback(err);
            }
        });
    });
    
    //Delete us from friends sent or received requests array
    Profile.findOne({ 'username': friend }, function(err, user) {
        if(err) {
            return callback(err);
        }
        if(!user) {
            return callback();
        }
        
        var pos1 = user.receivedRequests.indexOf(username),
            pos2 = user.sentRequests.indexOf(username);
        
        if(pos1 != -1) {
            user.receivedRequests.splice(pos1, 1);
        }
        if(pos2 != -1) {
            user.sentRequests.splice(pos2, 1);
        }
        user.mutualFriends.push(username);
        
        Profile.update({ 'username': friend}, { 'sentRequests': user.sentRequests, 'receivedRequests': user.receivedRequests, 'mutualFriends': user.mutualFriends }, function(err, update) {
            if(err) {
                return callback(err);
            }
        });
    });
    
    //Send the callback
    return callback(null, {
        response: 'Successfully accepted friend request from ' + friend
    });
    
}