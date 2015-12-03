var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var registrationSchema = new Schema({
    username: String,
    password: String,
    name: {
        first: String,
        last: String
    },
    dob: Date,
    email: String
});

var User = mongoose.model('registrationModel', registrationSchema);

module.exports.addNewUser = function(user, callback) {
    var user = new User({
        username: user.username,
        password: user.password,
        name: user.name,
        dob: user.dob,
        email: user.email
    });
    
    user.save(function(err, result) {
        if(err) {
            throw(err);
        }
        callback({
            response: "Successfully added one new user.",
            user: result
        });
    });
}