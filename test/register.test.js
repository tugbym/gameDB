var assert = require('assert'),
    request = require('supertest'),
    should = require('should'),
    agent = request.agent('http://localhost:3000'),
    register = require('../models/register-model'),
    mongoose = require('mongoose'),
    app = require('../app');

describe('Register Route', function() {
    
    it('Should display registration page', function(done) {
        agent.get('/register').expect(200, done);
    });
    
    it('Should register a new user', function(done) {
        agent.post('/register').send({
            username: 'testing3',
            password: 'testing3',
            first_name: 'Testing',
            last_name: 'Testing',
            date_of_birth: '01/01/1990',
            email_address: 'test@test.com'
        }).expect(200).end(function(err, res) {
            res.text.toString().search('You have been successfully registered.').should.not.equal(-1);
            done();
        });
    });
    
});

after(function(done) {
    
    register.deleteUser({
        username: 'testing3',
        password: 'testing3'
    }, function(err, response) {
        should.not.exist(err);
        should.exist(response);
        (response).should.be.exactly("Successfully deleted user: testing3").and.be.a.String();
        
        register.deleteUser({
            username: 'testing',
            password: 'testing'
        }, function(err, response) {
            should.not.exist(err);
            should.exist(response);
            (response).should.be.exactly("Successfully deleted user: testing").and.be.a.String();
            done();
        });
        
    });
});