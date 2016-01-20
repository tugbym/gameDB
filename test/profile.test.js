var assert = require('assert'),
    request = require('supertest'),
    should = require('should'),
    agent = request.agent('http://localhost:3000'),
    register = require('../models/register-model'),
    mongoose = require('mongoose'),
    app = require('../app');

describe('Profile Route', function() {
    
    describe('Accessing the Route', function() {
        
        it('GET profile should not grant me access when not logged in', function(done) {
            agent.get('/profile/testing').expect(401, done);
        });
        
        it('POST profile should not grant me access when not logged in', function(done) {
            agent.post('/profile/testing').expect(401, done);
        });
        
        it('POST add friend should not grant me access when not logged in', function(done) {
            agent.post('/profile/testing/add_friend').expect(401, done);
        });
        
        it('POST accept friend request should not grant me access when not logged in', function(done) {
            agent.post('/profile/testing/accept_request').expect(401, done);
        });
        
        it('No user entered should give a 404 response', function(done) {
            agent.get('/profile').expect(404, done);
        });
        
        it('Invalid profile should give a 404 response', function(done) {
            agent.post('/login').send({
                username: 'testing',
                password: 'testing'
            }).then(function() {
                agent.get('/profile/not_a_user').expect(404, done);
            });
        });
        
        it('GET profile should grant me access when logged in', function(done) {
            agent.get('/profile/testing').expect(200, done);
        });
        
    });
    
    describe('Editing and Deleting a Game', function() {
        
        it('Should edit one games info', function(done) {
            agent.post('/profile/testing').send({
                achievements_completed: 50,
                achievements_total: 50,
                current_progress: 'Doing a quest',
                to_do: 'Do more quests',
                your_rating: 5,
                your_review: 'It is a great game',
                selected_game_to_edit: 'Shin Megami Tensei: Persona 4',
                selected_console_to_edit: 'PS2'
            }).then(function() {
                agent.get('/profile/testing').expect(200).end(function(err, res) {
                    res.text.toString().search('It is a great game').should.not.equal(-1);
                    done();
                });
            });
        });
        
        it('Should edit other games info', function(done) {
            agent.post('/profile/testing').send({
                achievements_completed: 50,
                achievements_total: 50,
                current_progress: 'Doing a quest',
                to_do: 'Do more quests',
                your_rating: 5,
                your_review: 'It is a greater game',
                selected_game_to_edit: 'Persona 4 Golden',
                selected_console_to_edit: 'PSNV'
            }).then(function() {
                agent.get('/profile/testing').expect(200).end(function(err, res) {
                    res.text.toString().search('It is a great game').should.not.equal(-1);
                    res.text.toString().search('It is a greater game').should.not.equal(-1);
                    done();
                });
            });
        });
        
        it('Should delete one game', function(done) {
            agent.post('/profile/testing').send({
                selected_console: 'PSNV',
                selected_game: 'Persona 4 Golden'
            }).then(function() {
                agent.get('/profile/testing').expect(200).end(function(err, res) {
                    //Should have deleted
                    res.text.toString().search('It is a greater game').should.equal(-1);
                    res.text.toString().search('Persona 4 Golden').should.equal(-1);
                
                    //Should have not deleted
                    res.text.toString().search('Shin Megami Tensei: Persona 4').should.not.equal(-1);
                    res.text.toString().search('It is a great game').should.not.equal(-1);
                    done();
                });
            });
        });
        
        it('Should delete other game', function(done) {
            agent.post('/profile/testing').send({
                selected_console: 'PS2',
                selected_game: 'Shin Megami Tensei: Persona 4'
            }).then(function() {
                agent.get('/profile/testing').expect(200).end(function(err, res) {
                    res.text.toString().search('It is a greater game').should.equal(-1);
                    res.text.toString().search('Persona 4 Golden').should.equal(-1);
                    res.text.toString().search('Shin Megami Tensei: Persona 4').should.equal(-1);
                    res.text.toString().search('It is a great game').should.equal(-1);
                    done();
                });
            });
        });
        
    });
    
    describe('Adding a Friend', function() {
        
        before(function(done) {
            register.addNewUser({
                username: 'testing2',
                password: 'testing2',
                name: {
                    first: 'Testing',
                    last: 'Testing'
                },
                dob: '01/01/1990',
                email: 'test@test.com'
            }, function(err, response) {
                should.not.exist(err);
                should.exist(response);
                (response).should.be.exactly("Successfully added one new user.").and.be.a.String();
                done();
            });
        });
        
        it('Should display an add friend button on other users profile', function(done) {
            
            agent.get('/profile/testing2').expect(200).end(function(err, res) {
                res.text.toString().search('Send Friend Request').should.not.equal(-1);
                done();
            });
            
        });
        
        it('Should list sent requests on user profile', function(done) {
            
            agent.post('/profile/testing2/add_friend').then(function() {
                agent.get('/profile/testing2').expect(200).end(function(err, res) {
                    res.text.toString().search('This user has received your friend request.').should.not.equal(-1);
                    agent.get('/profile/testing').expect(200).end(function(err, res) {
                        res.text.toString().search('testing2').should.not.equal(-1);
                        done();
                    });
                });
            });
            
        });
        
        it('Should cancel sent request', function(done) {
            
            agent.post('/profile/testing2/cancel_request').then(function() {
                agent.get('/profile/testing2').expect(200).end(function(err, res) {
                    res.text.toString().search('This user has received your friend request.').should.equal(-1);
                    res.text.toString().search('Send Friend Request').should.not.equal(-1);
                    agent.get('/profile/testing').expect(200).end(function(err, res) {
                        res.text.toString().search('Sent Requests').should.equal(-1);
                        done();
                    });
                });
            });
            
        });
        
        it('Should list received requests on user profile', function(done) {
            
            agent.post('/profile/testing2/add_friend').then(function() {
                agent.get('/logout').then(function() {
                    agent.post('/login').send({
                        username: 'testing2',
                        password: 'testing2'
                    }).then(function() {
                        agent.get('/profile/testing2').expect(200).end(function(err, res) {
                            res.text.toString().search('Received Requests').should.not.equal(-1);
                            res.text.toString().search('testing').should.not.equal(-1);
                            res.text.toString().search('Accept Request').should.not.equal(-1);
                            done();
                        });
                    });
                });
            });
            
        });
        
        it('Should display an accept request button on friends page', function(done) {
            
            agent.get('/profile/testing').expect(200).end(function(err, res) {
                res.text.toString().search('Accept Friend Request').should.not.equal(-1);
                done();
            });
            
        });
        
        it('Should decline received request', function(done) {
            
            agent.post('/profile/testing/decline_request').then(function() {
                agent.get('/profile/testing').expect(200).end(function(err, res) {
                    res.text.toString().search('Accept Friend Request').should.equal(-1);
                    res.text.toString().search('Decline Friend Request').should.equal(-1);
                    agent.get('/profile/testing2').expect(200).end(function(err, res) {
                        res.text.toString().search('Received Requests').should.equal(-1);
                        done();
                    });
                });
            });
            
        });
        
        it('Should accept the received request and turn request into a mutual friend', function(done) {
            
            agent.post('/profile/testing/add_friend').then(function() {
                agent.get('/logout').then(function() {
                    agent.post('/login').send({
                        username: 'testing',
                        password: 'testing'
                    }).then(function() {
                        agent.post('/profile/testing2/accept_request').then(function() {
                            agent.get('/profile/testing2').expect(200).end(function(err, res) {
                                res.text.toString().search('You are friends with this user.').should.not.equal(-1);
                                agent.get('/profile/testing').expect(200).end(function(err, res) {
                                    res.text.toString().search('Mutual Friends').should.not.equal(-1);
                                    res.text.toString().search('Received Requests').should.equal(-1);
                                    done();
                                });
                            });
                        });
                    });
                });
            });
            
        });
        
        it('Friend should have their sent request changed into a mutual friend', function(done) {
            
            agent.get('/logout').then(function() {
                agent.post('/login').send({
                    username: 'testing2',
                    password: 'testing2'
                }).then(function() {
                    agent.get('/profile/testing2').expect(200).end(function(err, res) {
                        res.text.toString().search('Mutual Friends').should.not.equal(-1);
                        res.text.toString().search('Sent Requests').should.equal(-1);
                        done();
                    });
                });
            });
            
        });
        
        it('Should remove mutual friend', function(done) {
            
            agent.post('/profile/testing/remove_friend').then(function() {
                agent.get('/profile/testing').expect(200).end(function(err, res) {
                    res.text.toString().search('You are friends with this user.').should.equal(-1);
                    res.text.toString().search('Send Friend Request').should.not.equal(-1);
                    agent.get('/profile/testing2').expect(200).end(function(err, res) {
                        res.text.toString().search('Mutual Friends').should.equal(-1);
                        done();
                    });
                });
            });
            
        });
        
        it('Should not send a request to a user that does not exist', function(done) {
            agent.post('/profile/not_a_user/add_friend').expect(404, done);
        });
        
        it('Should not accept a request from a user that does not exist', function(done) {
            agent.post('/profile/not_a_user/accept_request').expect(404, done);
        });
        
        it('Should not accept a request from a user that has not sent a request', function(done) {
            agent.post('/profile/testing/accept_request').expect(403, done);
        });
        
        it('Should not cancel a request from a user that does not exist', function(done) {
            agent.post('/profile/not_a_user/cancel_request').expect(404, done);
        });
        
        it('Should not cancel a request from a user that has not sent a request', function(done) {
            agent.post('/profile/testing/cancel_request').expect(403, done);
        });
        
        it('Should not decline a request from a user that does not exist', function(done) {
            agent.post('/profile/not_a_user/decline_request').expect(404, done);
        });
        
        it('Should not decline a request from a user that has not sent a request', function(done) {
            agent.post('/profile/testing/decline_request').expect(403, done);
        });
        
        it('Should not remove a mutual friend that does not exist', function(done) {
            agent.post('/profile/not_a_user/remove_friend').expect(404, done);
        });
        
        it('Should not remove a mutual friend that is not a mutual friend', function(done) {
            agent.post('/profile/testing/remove_friend').expect(403, done);
        });
        
        after(function(done) {
            register.deleteUser({
                username: 'testing2',
                password: 'testing2'
            }, function(err, response) {
                should.not.exist(err);
                should.exist(response);
                (response).should.be.exactly("Successfully deleted user: testing2").and.be.a.String();
                done();
            });
        });
        
    });
    
});