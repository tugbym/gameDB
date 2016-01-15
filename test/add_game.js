var assert = require('assert'),
    request = require('supertest'),
    agent = request.agent('http://localhost:3000');

describe('Add Game Route', function() {
    it('Should not grant me access if not logged in', function(done) {
        agent.get('/add_game').expect(401, done);
    });
});