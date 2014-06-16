"use strict";

module.exports = function( grunt )
{
  grunt.initConfig(
  {
    uglify: {
      options: {
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
