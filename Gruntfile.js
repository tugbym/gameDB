'use strict';

module.exports = function (grunt) {
grunt.initConfig({
    jshint: {
        options: {
            curly: true,
            eqeqeq: true,
            eqnull: true,
            browser: true
        },
        all: [
            './routes/*.js'
        ]
    },
    express: {
        options: {
            output: "Listening on port [0-9]{4}",
            port: 3000
        },
        server: {
            options: {
                script: 'bin/www',
                node_env: 'test'
            }
        }
    },
    simplemocha: {
        options: {
            ui: 'bdd',
            globals: [],
            timeout: 15000,
            ignoreLeaks: false,
            fullTrace: true,
            reporter: 'spec'
        },
        all: { src: ['test/*.test.js'] }
    }
})

grunt.loadNpmTasks('grunt-express-server');
grunt.loadNpmTasks('grunt-simple-mocha');
grunt.loadNpmTasks('grunt-contrib-jshint');

grunt.registerTask('default', ['jshint', 'express:server', 'simplemocha', 'express:server:stop'])
}