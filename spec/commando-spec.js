describe("Commando", function() {
  "use strict";

  var expect = require("chai").expect,
      sinon = require("sinon"),
      commando = require("commando"),
      Q = require("q"),
      extend = require("lodash").extend;

  var valid = { username: "john.doe" },
      validation = { valid: true, payload: valid },
      invalid = { username: "john" },
      errors = [{ username: ["too short"] }],
      invalidation = { valid: false, payload: invalid, errors: errors},
      event = "some created event";

  var sandbox, validate, createEvent, storeEvent,
      publishEvent, Command, command;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    validate = sandbox.stub();
    validate.withArgs(valid).returns(validation);
    validate.withArgs(invalid).returns(invalidation);
    createEvent = sandbox.stub().returns(event);
    storeEvent = sandbox.stub().returnsArg(0);
    publishEvent = sandbox.stub().returnsArg(0);

    Command = commando({
      when: Q.when,
      extend: extend,
      storeEvent: storeEvent,
      publishEvent: publishEvent
    });

    command = new Command({
      validate: validate,
      createEvent: createEvent
    });

  });

  afterEach(function() { sandbox.restore(); });

  describe("With valid parameters", function() {
    var resolution;

    beforeEach(function(done) {
      function onResolve(res) { resolution = res; done(); }
      function onReject(err) { throw err; }
      command.execute(valid).then(onResolve, onReject);
    });

    it("validates", function() {
      sinon.assert.calledWith(validate, valid);
    });

    it("creates, stores, and publishes an event (in that order)", function() {
      sinon.assert.calledWith(createEvent, valid);
      sinon.assert.calledWith(storeEvent, event);
      sinon.assert.calledWith(publishEvent, event);
      sinon.assert.callOrder(validate, createEvent, storeEvent, publishEvent);
    });

    it("resolves with the event", function() {
      expect(resolution).to.eql(event);
    });

  });

  describe("With invalid parameters", function() {
    var rejection;

    beforeEach(function(done) {
      function onResolve(res) { throw "Unexpected resolution: " + res; }
      function onReject(err) { rejection = err; done(); }
      command.execute(invalid).then(onResolve, onReject);
    });

    it("rejects with the validation error", function() {
      expect(rejection).to.eql(invalidation);
    });

    it("does not create, store, or publish the event", function() {
      sinon.assert.notCalled(createEvent);
      sinon.assert.notCalled(storeEvent);
      sinon.assert.notCalled(publishEvent);
    });

  });

});
