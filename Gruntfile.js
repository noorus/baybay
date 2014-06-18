"use strict";

module.exports = function( grunt )
{
  grunt.initConfig(
  {
    pkg: grunt.file.readJSON( "package.json" ),
    uglify: {
      options: {
        banner: "/*! <%= pkg.name %>.js v<%= pkg.version %> | <%= pkg.repository.url %> | <%= pkg.license %> license */\r\n"
      },
      build: {
        files: {
          "baybay.min.js": ["baybay.js"]
        }
      }
    },
    mochaTest: {
      uncompressed: {
        options: {
          reporter: "spec"
        },
        src: ["test/uncompressed.js"]
      },
      compressed: {
        options: {
          reporter: "spec"
        },
        src: ["test/compressed.js"]
      }
    }
  });

  grunt.loadNpmTasks( "grunt-contrib-uglify" );
  grunt.loadNpmTasks( "grunt-mocha-test" );

  grunt.registerTask( "default", ["mochaTest:uncompressed","uglify","mochaTest:compressed"] );
  grunt.registerTask( "test", ["mochaTest"] );
};
