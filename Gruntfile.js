module.exports = function(grunt) {
  "use strict";

  var config = {};

  config.pkg = grunt.file.readJSON('package.json');

  // Main jshint configuration
  config.jshint = { options: grunt.file.readJSON('./.jshintrc') };

  // Source files
  config.jshint.source = {
    files: { src: "./src/**/*.js" },
    options: {
      node: true,
      globals: {
        define: true,
        module: true,
        require: true
      }
    }
  };

  // Spec files
  config.jshint.specs = {
    files: { src: "./spec/**/*.js" },
    options: {
      node: true,
      globals: {
        define: true,
        describe: true,
        beforeEach: true,
        afterEach: true,
        it: true,
        expect: true
      }
    }
  };

  config.exec = {
    mocha: {
      cmd: "NODE_PATH=$NODE_PATH:./src mocha -c -R spec spec/**/*-spec.js"
    },
    blanket: {
      cmd: "NODE_PATH=$NODE_PATH:./src mocha -c -R html-cov --require blanket spec/**/*-spec.js > coverage.html && open coverage.html"
    }
  };

  config["feature:list"] = { options: { flags: ["-v"] } };
  config["feature:start"] = { options: { flags: ["-F"] } };
  config["release:list"] = { options: { flags: ["-v"] } };
  config["release:start"] = { options: { flags: ["-F "] } };
  config["release:finish"] = { options: { flags: ["-F", "-p"] } };
  config["hotfix:list"] = { options: { flags: ["-v"] } };
  config["hotfix:start"] = { options: { flags: ["-F "] } };
  config["hotfix:finish"] = { options: { flags: ["-F", "-p"] } };

  grunt.initConfig(config);
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-exec');
  grunt.registerTask('mocha', ['exec:mocha']);
  grunt.registerTask('blanket', ['exec:blanket']);

  grunt.registerTask('build', ['test']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('test', ['specs:require', 'lint', 'mocha', 'blanket']);
  grunt.registerTask('default', ['build']);
};
