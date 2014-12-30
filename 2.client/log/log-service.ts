"use strict";

import constants = require("../../1.server/browserify/constants/constants");

/** 
 * @module Log
 */
module Log {
  "use strict";

  // TODO create type definition for socketFactory (angular-socket-io) and PR into DefinitelyTyped
  var factory = (socket: any) => {
    /** 
     * Prints the given log message to browser console.
     * @param message {string} Log message.
     * @param meta {any} Optional meta object for additional debugs.
     */
    var printToConsole = (message: string, meta?: { [fieldName: string]: any; }) => {
      console.log(message, meta ? " | " + JSON.stringify(meta) : "");
    };

    /**
     * Info log. Sends the logged information to the server too.
     * @param message {string} Log message.
     * @param meta {any} Optional meta object for additional debugs.
     */
    var logInfo = (message: string, meta?: { [fieldName: string]: any; }) => {
      printToConsole("INFO | " + new Date() + " | " + message, meta);
      socket.emit(constants.socketEvents.log.info, { message: message, meta: meta });
    };

    /**
     * Debug log. Sends the logged information to the server too.
     * @param message {string} Log message.
     * @param meta {any} Optional meta object for additional debugs.
     */
    var logDebug = (message: string, meta?: { [fieldName: string]: any; }) => {
      printToConsole("DBG  | " + new Date() + " | " + message, meta);
      socket.emit(constants.socketEvents.log.debug, { message: message, meta: meta });
    };

    /**
     * Error log. Sends the logged information to the server too.
     * @param message {string} Log message.
     * @param meta {any} Optional meta object for additional debugs.
     */
    var logError = (message: string, meta?: { [fieldName: string]: any; }) => {
      printToConsole("ERR  | " + new Date() + " | " + message, meta);
      socket.emit(constants.socketEvents.log.error, { message: message, meta: meta });
    };

    /**
     * Warning log. Sends the logged information to the server too.
     * @param message {string} Log message.
     * @param meta {any} Optional meta object for additional debugs.
     */
    var logWarning = (message: string, meta?: { [fieldName: string]: any; }) => {
      printToConsole("WARN | " + new Date() + " | " + message, meta);
      socket.emit(constants.socketEvents.log.warning, { message: message, meta: meta });
    };

    // returning the object to the client
    return {
      info: logInfo,
      debug: logDebug,
      error: logError,
      warn: logWarning
    };
  };

  /**
   * Module details for Angular to consume.
   */ 
  export var meta: MetaModule = {
    moduleName: "log-service",
    serviceName: "log",
    serviceFunction: factory
  }
};

// initiating the socket factory 
angular
  .module(Log.meta.moduleName, [ ])
  .factory(Log.meta.serviceName, [
      "socket",
      Log.meta.serviceFunction
    ]);

export = Log;
