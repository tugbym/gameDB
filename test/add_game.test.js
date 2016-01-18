var assert = require('assert'),
    request = require('supertest'),
    should = require('should'),
    agent = request.agent('http://localhost:3000'),
    register = require('../models/register-model'),
    mongoose = require('mongoose'),
    app = require('../app');

before(function(done) {
    register.addNewUser({
        username: 'testing',
        password: 'testing',
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

describe('Add Game Route', function() {
    
    describe('Accessing the Route', function() {
        it('Should not grant me access if not logged in', function(done) {
            agent.get('/add_game').expect(401, done);
        });
        it('Should not grant me access if not logged in', function(done) {
            agent.post('/add_game').expect(401, done);
        });
        it('Should grant me access when logged in', function(done) {
            agent.post('/login').send({
                username: 'testing',
                password: 'testing'
            }).then(function() {
                agent.get('/add_game').expect(200, done);
            });
        });
    });
    
    describe('Adding a game', function() {
        
        /*it('API should respond with list of games', function(done) {
            agent.post('/add_game').send({
                search_query: 'Persona 4',
                search_by: 'game'
            }).expect(200).end(function(err, res) {
                should.not.exist(err);
                should.exist(res);
                res.should.have.property('text');
                var html = res.text.toString();
                html.search('Persona 4').should.not.equal(-1);
                html.search('PS2').should.not.equal(-1);
                done();
            });
        });*/
        
        it('Should add a game to user profile', function(done) {
            agent.post('/add_game').send({
                selected_game: 'Shin Megami Tensei: Persona 4',
                selected_console: 'PS2'
            }).expect(200).end(function(err, res) {
                should.not.exist(err);
                should.exist(res);
                res.should.have.property('text');
                res.text.toString().search('Successfully added: Shin Megami Tensei: Persona 4').should.not.equal(-1);
                done();
            });
        });
        
        it('Should not add the same game twice to user profile', function(done) {
            agent.post('/add_game').send({
                selected_game: 'Shin Megami Tensei: Persona 4',
                selected_console: 'PS2'
            }).expect(409).end(function(err, res) {
                should.exist(res);
                res.should.have.property('text');
                res.text.toString().search('You already have this game added.').should.not.equal(-1);
                agent.get('/profile/testing').end(function(err, res) {
                    res.text.toString().search(/(Shin Megami Tensei: Persona 4.*){4}/).should.equal(-1);
                    done();
                });
            });
        });
        
        it('Should add a second game to user profile', function(done) {
            agent.post('/add_game').send({
                selected_game: 'Persona 4 Golden',
                selected_console: 'PSNV'
            }).expect(200).end(function(err, res) {
                should.not.exist(err);
                should.exist(res);
                res.should.have.property('text');
                res.text.toString().search('Successfully added: Persona 4 Golden').should.not.equal(-1);
                done();
            });
        })
        
    });
});