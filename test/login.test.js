var assert = require('assert'),
    request = require('supertest'),
    should = require('should'),
    agent = request.agent('http://localhost:3000'),
    register = require('../models/register-model'),
    mongoose = require('mongoose'),
    app = require('../app');

describe('Login Route', function() {
    
    it('Invalid username sends an error flash', function(done) {
        agent.post('/login').send({
            username: 'not_a_user',
            password: 'testing'
        }).expect(401).end(function(err, res) {
            res.text.toString().search('Incorrect username.').should.not.equal(-1);
            done();
        });
    });
    
    it('Invalid password sends an error flash', function(done) {
        agent.post('/login').send({
            username: 'testing',
            password: 'not_a_password'
        }).expect(401).end(function(err, res) {
            res.text.toString().search('Incorrect password.').should.not.equal(-1);
            done();
        });
    });
    
});