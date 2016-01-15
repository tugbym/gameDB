'use strict';

module.exports = function (grunt) {
grunt.initConfig({
    express: {
        options: {
            output: "Listening on port [0-9]{4}"
        },
        server: {
            options: {
                script: 'bin/www'
            }
        }
    },
    simplemocha: {
        options: {
            ui: 'bdd',
            globals: [],
            timeout: 3000,
            ignoreLeaks: false,
            reporter: 'spec'
        },
        all: { src: ['test/*.js'] }
    }
})

grunt.loadNpmTasks('grunt-express-server')
grunt.loadNpmTasks('grunt-simple-mocha')

grunt.registerTask('default', ['express:server', 'simplemocha', 'express:server:stop'])
}