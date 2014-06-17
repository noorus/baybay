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
    }
  });

  grunt.loadNpmTasks( "grunt-contrib-uglify" );

  grunt.registerTask( "default", ["uglify"] );
};
