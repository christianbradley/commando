function factory(deps) {
  "use strict";

  var when = deps.when,
      extend = deps.extend,
      storeEvent = deps.storeEvent,
      publishEvent = deps.publishEvent;

  function Command(config) {
    extend(this, config);
  }

  Command.prototype = {
    constructor: Command,
    validate: void 0,
    createEvent: void 0,
    storeEvent: storeEvent,
    publishEvent: publishEvent,

    execute: function(params) {

      function checkValidation(result) {
        if(!result.valid) throw result;
        return params;
      }

      var promise =
            when(this.validate(params)).
            then(checkValidation).
            then(this.createEvent).
            then(this.storeEvent).
            then(this.publishEvent);

      return promise;
    }
  };

  Command.execute = Command.prototype.execute.call;

  return Command;

}

module.exports = factory;
