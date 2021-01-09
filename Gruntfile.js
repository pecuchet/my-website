var path = require('path');

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'themes/db-5/index.html',
                    'dist/templates/page.html': 'themes/db-5/templates/page.html',
                    'dist/templates/grid.html': 'themes/db-5/templates/grid.html'
                }
            }
        },
        cssmin: {
            options: {
                processImport : true
            },
            concat: {
                files: {
                    'dist/css/master.min.css': ['themes/db-5/css/master.css']
                }
            }
        },
        requirejs: {
            alm : {
                options: {
                    baseUrl: 'themes/db-5/js',
                    mainConfigFile: 'themes/db-5/js/main.js',
                    name: path.resolve('node_modules/almond/almond.js'),
                    include: 'main.js',
                    optimize: 'uglify2',
                    out: 'dist/js/main.min.js',
                    wrap: true,
                    onBuildWrite: function ( name, path, content ) {
                        // remove urlArgs cache busting
                        return content.replace( /urlArgs:\s*"bust="\s*\+\s*\(new Date\(\)\)\.getTime\(\),/, '' );
                    }
                }
            },
            test: {
                options: {
                    baseUrl: 'themes/db-5/js',
                    mainConfigFile: 'themes/db-5/js/main.js',
                    paths: {
                        fastclick: 'empty:',
                        requireLib: 'libs/require'
                    },
                    include: [
                        'requireLib'
                    ],
                    exclude: [
                        'fastclick'
                    ],
                    name: 'main',
                    optimize: 'none',
                    out: 'dist/js/main.js',
                    logLevel: 0,
                    findNestedDependencies: true
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('html', ['htmlmin']);
    grunt.registerTask('css', ['cssmin:concat']);
    grunt.registerTask('rjs', ['requirejs:test']);
    grunt.registerTask('alm', ['requirejs:alm']);

    grunt.registerTask('build', ['html','css','alm']);
    grunt.registerTask('default', ['html','css','alm']);
};