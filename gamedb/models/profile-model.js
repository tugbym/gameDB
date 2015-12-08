var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var profileSchema = new Schema({
    userID: String,
    username: String,
    gamesOwned: [],
    gamesWanted: []
});

var Profile = mongoose.model('profileModel', profileSchema);

module.exports.getGameList = function(id, callback) {
    Profile.findOne({ 'userID': id }, function(err, user) {
        if(err) {
            return callback(err);
        }
        if(!user) {
            return callback(null, null);
        }
        return callback(null, {
            response: 'Successfully found user.',
            user: user
        });
    });
}