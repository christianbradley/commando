module.exports = function(grunt) {
  "use strict";

  var cp = require("child_process")
    , semver = require("semver")
    , Q = require("q");

  function exec(command, args) {
    grunt.log.ok([command, args.join(" ")].join(" "));

    var child = cp.spawn(command, args, { env: process.env, stdio: "inherit" });
    var deferred = Q.defer();

    child.on("exit", function(code) {
      var success = (code === 0);
      var callback = success ? deferred.resolve : deferred.reject;
      callback(success, code);
    });

    return deferred.promise;
  }

  function flow(command, done, args, flags) {
    args = args || [];
    flags = flags || [];

    args = ["flow"].
      concat(command.split(" ")).
      concat(flags).
      concat(args).
      filter(function(value) { return typeof value !== 'undefined' && value !== null; });

    exec("git", args).then(done, done);
  }

  // Start a feature
  grunt.registerTask("feature:start", "Start new feature <name>, optionally basing it on <base> instead of develop.", function(name, base) {
    var flags = this.options({ flags: null }).flags;
    flow("feature start", this.async(), [name, base], flags);
  });

  grunt.registerTask("feature:list", "List existing features", function() {
    var flags = this.options({ flags: null }).flags;
    flow("feature list", this.async(), null, flags);
  });

  grunt.registerTask("feature:finish", "Finish feature <name>", function(name) {
    this.requires("test");
    var flags = this.options({ flags: null }).flags;
    flow("feature finish", this.async(), [name], flags);
  });

  grunt.registerTask("feature:publish", "Start sharing feature <name> on $ORIGIN", function(name) {
    this.requires("test");
    flow("feature publish", this.async(), [name]);
  });

  grunt.registerTask("feature:track", "Start tracking feature <name> that is shared on $ORIGIN", function(name) {
    flow("feature track", this.async(), [name]);
  });

  grunt.registerTask("feature:diff", "Show all changes in <name> that are not in develop", function(name) {
    flow("feature diff", this.async(), [name]);
  });

  grunt.registerTask("feature:rebase", "Rebase <name> on develop.", function(name) {
    var flags = this.options({ flags: null }).flags;
    flow("feature rebase", this.async(), [name], flags);
  });

  grunt.registerTask("feature:checkout", "Switch to feature branch <name>", function(name) {
    flow("feature checkout", this.async(), [name]);
  });

  grunt.registerTask("feature:pull", "Pull feature from <remote> with name <name>", function(remote, name) {
    flow("feature pull", this.async(), [remote, name]);
  });

  grunt.registerTask("release:list", "List existing releases", function() {
    var flags = this.options({ flags: null }).flags;
    flow("release list", this.async(), null, flags);
  });

  ["patch", "minor", "major"].forEach(function(bumpType) {
    grunt.registerTask("release:" + bumpType, "Start a new " + bumpType + " release", function() {
      this.requiresConfig("pkg.version");
      this.requires("test");

      var flags = this.options({ flags: null }).flags;
      var version = semver.inc(grunt.config.get("pkg.version"), bumpType);

      flow("release start", this.async(), [version], flags);
      grunt.task.run("bump:" + bumpType);
    });
  });

  grunt.registerTask("release:finish", "Finish release <version>", function(version) {
    this.requires("test");
    var flags = this.options({ flags: null }).flags;
    flow("release finish", this.async(), [version], flags);
  });

  grunt.registerTask("release:publish", "Start sharing release <version> on $ORIGIN", function(version) {
    this.requires("test");
    flow("release publish", this.async(), [version]);
  });

  grunt.registerTask("release:track", "Start tracking release <version> that is shared on $ORIGIN", function(version) {
    flow("release track", this.async(), [version]);
  });

  grunt.registerTask("hotfix:list", "List existing hotfixes", function() {
    var flags = this.options({ flags: null }).flags;
    flow("hotfix list", this.async(), null, flags);
  });

  grunt.registerTask("hotfix:start", "Start a new hotfix named <version>, optionally base it on <base> instead of <master>", function(version, base) {
    var flags = this.options({ flags: null }).flags;
    flow("hotfix start", this.async(), [version, base], flags);
  });

  grunt.registerTask("hotfix:finish", "Finish hotfix <version>", function(version) {
    this.requires("test");
    var flags = this.options({ flags: null }).flags;
    flow("hotfix finish", this.async(), [version], flags);
  });

};
