module.exports = function(grunt) {
  "use strict";

  var glob = require("glob")
    , path = require("path")
    , fs = require("fs")
    , log = grunt.log
    , _ = require("lodash");

  grunt.registerTask("specs:require", function() {
    var rootDir = path.resolve(path.join(__dirname, ".."));
    var srcDir = path.join(rootDir, "src");
    var srcPattern = path.join(srcDir, "**", "*.js");
    var scripts = glob.sync(srcPattern);

    // Compile a list of expected spec file names
    var specsDir = path.join(rootDir, "spec");
    var specs = _.map(scripts, function(p) {
      var specName = p.slice(srcDir.length + 1, -3) + "-spec.js";
      return path.join(specsDir, specName);
    });

    // Get a list of missing specs
    var missing = _.reject(specs, function(p) {
      return fs.existsSync(p);
    });

    if(missing.length > 0) {
      log.error("Missing the following javascript specs:");
      log.write(missing.join("\n") + "\n");
      return false;

    } else {
      log.ok("All scripts have associated specs.");
      return true;
    }

  });
};
