import log = require("../log/log")

/** 
 * @module UtilityEvents
 * Module for handling the misc and utility like events. Basically a simplistic wrapper for some production vs
 * development events.
 */
module UtilityEvents {
  var constants = {
    productionVariable: "NODE_ENV"
  };

  var events = {
    /** 
     * Handles the uncaught exception events from the node module when the errors are thrown up the stack.
     */
    uncaughtException: { 
      message: "uncaughtException",
      fn: (error: any) => {
        if (process.env[constants.productionVariable] === "production") {
          // we are running in production mode
          log.error("Digesting the uncaughtException in utility-events module. Running in production mode.", error);
        } else {
          // we are running in development mode - stopping the application, reporting the damage to the developer
          log.error("uncaughtException captured in utility-events module, stopping application.", error);
          process.exit(1);
        } 
      }
    }
  };

  /** 
   * Initialises the UtilityEvents module and hooks it into the correct processes
   */
  export function hook() {
    log.debug("Production mode status", { NODE_ENV: process.env.NODE_ENV === undefined ? "development" : "production" });
    // setting up the hooks for process events when there are events that the application let slip through
    process.on(events.uncaughtException.message, events.uncaughtException.fn);
  }
}

export = UtilityEvents;
