var assert = require('assert'),
    request = require('supertest'),
    should = require('should'),
    agent = request.agent('http://localhost:3000'),
    register = require('../models/register-model'),
    mongoose = require('mongoose'),
    app = require('../app');

describe('Index Route', function() {
    
    it('Should not display logout or friends when not logged in', function(done) {
        agent.get('/').expect(200).end(function(err, res) {
            res.text.toString().search('Logout').should.equal(-1);
            res.text.toString().search('Friends').should.equal(-1);
            done();
        });
    });
    
    it('Should display logout and friends when logged in', function(done) {
        agent.post('/login').send({
            username: 'testing',
            password: 'testing'
        }).then(function() {
            agent.get('/').expect(200).end(function(err, res) {
                res.text.toString().search('Logout').should.not.equal(-1);
                res.text.toString().search('Friends').should.not.equal(-1);
                done();
            });
        });
    });
    
});