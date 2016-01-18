var assert = require('assert'),
    request = require('supertest'),
    should = require('should'),
    agent = request.agent('http://localhost:3000'),
    register = require('../models/register-model'),
    mongoose = require('mongoose'),
    app = require('../app');

describe('Logout Route', function() {
    
    it('Logout should end the users session', function(done) {
        agent.post('/login').send({
            username: 'testing',
            password: 'testing'
        }).then(function() {
            agent.get('/logout').expect(200).end(function(err, res) {
                res.text.toString().search('Logout').should.equal(-1);
                res.text.toString().search('Friends').should.equal(-1);
                done();
            });
        });
    });
    
});