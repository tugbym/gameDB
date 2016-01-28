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
        
        gamesOwned.forEach(function(gamesList, index) {
            if(gamesList.console === newGame.console) {
                gamesList.games.forEach(function(game) {
                    if(game.title === newGame.title) {
                        error = new Error;
                        error.message = "You already have this game added.";
                        error.status = 409;
                    }
                });
            }
        });
        
        if(error) {
            return callback(error);
        }
        
        var consolePos;
        
        gamesOwned.forEach(function(gamesList, index) {
            if(gamesList.console === newGame.console) {
                consolePos = index;
            }
        });
        
        if(consolePos) {
            gamesOwned[consolePos].games.push(newGame);
        } else {
            gamesOwned.push({ 'console': newGame.console, 'games': [newGame] });
        }
        
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
        
        gamesOwned.forEach(function(gameList, listIndex) {
            if(gameList.console === gameToDelete.console) {
                gameList.games.forEach(function(gameOwned, gameIndex) {
                    if(gameOwned.title === gameToDelete.title) {
                        gamesOwned[listIndex].games.splice(gameIndex, 1);
                    }
                    if(!gameList.games[0]) {
                        gamesOwned.splice(listIndex, 1);
                    }
                });
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
        
        gamesOwned.forEach(function(gameList, listIndex) {
            if(gameList.console === gameInfo.console) {
                gameList.games.forEach(function(gameOwned, gameIndex) {
                    if(gameOwned.title === gameInfo.title) {
                        gamesOwned[listIndex].games[gameIndex] = gameInfo;
                    }
                });
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
    
    var error;
    
    //Update our friends received requests array
    Profile.findOne({ 'username': friend }, function(err, user) {
        if(err) {
            return callback(err);
        }
        if(!user) {
            error = new Error;
            error.message = "This user does not exist";
            error.status = 404;
            return callback(error);
        }
        
        var receivedRequests = user.receivedRequests;
        receivedRequests.push(username);
        
        Profile.update({ 'username': friend }, { 'receivedRequests': receivedRequests }, function(err, update) {
            if(err) {
                return callback(err);
            }
            //Update our sent requests array
            Profile.findOne({ 'username': username }, function(err, user) {
                if(err) {
                    return callback(err);
                }
                if(!user) {
                    error = new Error;
                    error.message = "This user does not exist";
                    error.status = 404;
                    return callback(error);
                }
        
                var sentRequests = user.sentRequests;
                sentRequests.push(friend);
        
                Profile.update({ 'username': username }, { 'sentRequests': sentRequests }, function(err, update) {
                    if(err) {
                        return callback(err);
                    }
                    //Send the callback
                    return callback(null, {
                        response: 'Successfully sent friend request from ' + username + ' to ' + friend
                    });
                });
            });
        });
    });
}

module.exports.acceptFriendRequest = function(username, friend, callback) {
    
    var error;
    
    //Delete us from friends sent or received requests array
    Profile.findOne({ 'username': friend }, function(err, user) {
        if(err) {
            return callback(err);
        }
        if(!user) {
            error = new Error;
            error.message = "This user does not exist";
            error.status = 404;
            return callback(error);
        }
        
        var pos1 = user.receivedRequests.indexOf(username),
            pos2 = user.sentRequests.indexOf(username);
        
        if(pos1 === -1 && pos2 === -1) {
            error = new Error;
            error.message = 'You have not been sent or received a friend request from this user.';
            error.status = 403;
            return callback(error);
        }
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
            //Delete friend from sent or received requests array
            Profile.findOne({ 'username': username }, function(err, user) {
                if(err) {
                    return callback(err);
                }
                if(!user) {
                    error = new Error;
                    error.message = "This user does not exist";
                    error.status = 404;
                    return callback(error);
                }
        
                var pos1 = user.receivedRequests.indexOf(friend),
                    pos2 = user.sentRequests.indexOf(friend);
        
                if(pos1 === -1 && pos2 === -1) {
                    error = new Error;
                    error.message = 'No such friend has been sent or received a friend request.';
                    error.status = 403;
                    return callback(error);
                }
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
                    //Send the callback
                    return callback(null, {
                        response: 'Successfully accepted friend request from ' + friend
                    });
                });
            }); 
        });
    });
}

module.exports.cancelFriendRequest = function(username, friend, callback) {
    
    var pos,
        error;
    
    //Delete us from friends received requests array
    Profile.findOne({ 'username': friend }, function(err, profile) {
        if(err) {
            return callback(err);
        }
        if(!profile) {
            error = new Error;
            error.message = "This user does not exist";
            error.status = 404;
            return callback(error);
        }

        pos = profile.receivedRequests.indexOf(username);
        if(pos === -1) {
            error = new Error;
            error.message = 'This user has not received a request.';
            error.status = 403;
            return callback(error);
        }
        
        profile.receivedRequests.splice(pos, 1);
        
        Profile.update({ 'username': friend }, { 'receivedRequests': profile.receivedRequests }, function(err, update) {
            if(err) {
                return callback(err);
            }
            //Delete friend from our sent requests array
            Profile.findOne({ 'username': username }, function(err, profile) {
                if(err) {
                    return callback(err);
                }
                if(!profile) {
                    error = new Error;
                    error.message = "This user does not exist";
                    error.status = 404;
                    return callback(error);
                }
        
                pos = profile.sentRequests.indexOf(friend);
                if(pos === -1) {
                    error = new Error;
                    error.message = 'You have not sent this user a request.';
                    error.status = 403;
                    return callback(error);
                }
        
                profile.sentRequests.splice(pos, 1);
        
                Profile.update({ 'username': username }, { 'sentRequests': profile.sentRequests }, function(err, update) {
                    if(err) {
                        return callback(err);
                    }
                    return callback(null, {
                        response: 'Successfully cancelled friend request to: ' + friend
                    });
                });
            });
        });
    });    
}

module.exports.declineFriendRequest = function(username, friend, callback) {
    
    var pos,
        error;
    
    //Delete us from friends sent requests array
    Profile.findOne({ 'username': friend }, function(err, profile) {
        if(err) {
            return callback(err);
        }
        if(!profile) {
            error = new Error;
            error.message = "This user does not exist";
            error.status = 404;
            return callback(error);
        }
        
        pos = profile.sentRequests.indexOf(username);
        if(pos === -1) {
            error = new Error;
            error.message = 'This user has not sent you a request.';
            error.status = 403;
            return callback(error);
        }
        
        profile.sentRequests.splice(pos, 1);
        
        Profile.update({ 'username': friend }, { 'sentRequests': profile.sentRequests }, function(err, update) {
            if(err) {
                return callback(err);
            }
            //Delete friend from our received requests array
            Profile.findOne({ 'username': username }, function(err, profile) {
                if(err) {
                    return callback(err);
                }
                if(!profile) {
                    error = new Error;
                    error.message = "This user does not exist";
                    error.status = 404;
                    return callback(error);
                }
        
                pos = profile.receivedRequests.indexOf(friend);
                if(pos === -1) {
                    error = new Error;
                    error.message = 'You have not received a request from this user.';
                    error.status = 403;
                    return callback(error);
                }
        
                profile.receivedRequests.splice(pos, 1);
        
                Profile.update({ 'username': username }, { 'receivedRequests': profile.receivedRequests }, function(err, update) {
                    if(err) {
                        return callback(err);
                    }
                    return callback(null, {
                        response: 'Friend request from: ' + friend + ' has been declined.'
                    });
                });
            });
        });
    });
}

module.exports.removeFriend = function(username, friend, callback) {
    
    var pos,
        error;
    
    //Delete us from friends mutual friends array
    Profile.findOne({ 'username': friend }, function(err, profile) {
        if(err) {
            return callback(err);
        }
        if(!profile) {
            error = new Error;
            error.message = "This user does not exist";
            error.status = 404;
            return callback(error);
        }
        
        pos = profile.mutualFriends.indexOf(username);
        if(pos === -1) {
            error = new Error;
            error.message = 'This user is not mutual friends with you';
            error.status = 403;
            return callback(error);
        }
        
        profile.mutualFriends.splice(pos, 1);
        
        Profile.update({ 'username': friend }, { 'mutualFriends': profile.mutualFriends }, function(err, update) {
            if(err) {
                return callback(err);
            }
            //Delete friend from our mutual friends array
            Profile.findOne({ 'username': username }, function(err, profile) {
                if(err) {
                    return callback(err);
                }
                if(!profile) {
                    error = new Error;
                    error.message = "This user does not exist";
                    error.status = 404;
                    return callback(error);
                }
        
                pos = profile.mutualFriends.indexOf(friend);
                if(pos === -1) {
                    error = new Error;
                    error.message = 'You are not mutual friends with this user.';
                    error.status = 403;
                    return callback(error);
                }
        
                profile.mutualFriends.splice(pos, 1);
        
                Profile.update({ 'username': username }, { 'mutualFriends': profile.mutualFriends }, function(err, update) {
                    if(err) {
                        return callback(err);
                    }
                    return callback(null, {
                        message: 'Removed friend: ' + friend
                    });
                });
            });
        });
    });   
}