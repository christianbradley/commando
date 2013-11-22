module.exports = function(grunt) {
  "use strict";

  var packagePath = "package.json";

  var semver = require("semver"),
    fs = require("fs"),
    log = grunt.log;

  function bump(type) {
    if(typeof type === 'undefined') { type = 'minor'; }

    var pkg = grunt.file.readJSON(packagePath);
    var version = pkg.version;

    if(semver.valid(version)) {
      pkg.version = semver.inc(version, type);

      fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));

      log.ok(["Bumped version from", version, "to", pkg.version].join(" "));
      return true;

    } else {

      log.error("Invalid version: " + version);
      return false;
    }

  }

  grunt.registerTask("bump:patch", function() {
    return bump("patch");
  });

  grunt.registerTask("bump:minor", function() {
    return bump("minor");
  });

  grunt.registerTask("bump:major", function() {
    return bump("major");
  });

};
