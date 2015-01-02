"use strict";

import constants = require("../../1.server/browserify/constants/constants");

/** 
 * @module Log
 */
module Log {
  "use strict";

  /** 
   * Interface for explaining the different levels of logging coming out of  the service. 
   */
  export interface Service {
    // the meta property has to be something with a field identifying it, following: { [fieldName: string]: any; }
    info:  (message: string, meta?: any) => void;  
    error: (message: string, meta?: any) => void;
    debug: (message: string, meta?: any) => void;
    warn:  (message: string, meta?: any) => void;
  };

  // TODO create type definition for socketFactory (angular-socket-io) and PR into DefinitelyTyped
  var factory = (socket: any) => {
    /** 
     * Prints the given log message to browser console.
     * @param message {string} Log message.
     * @param meta {any} Optional meta object for additional debugs.
     */
    var printToConsole = (message: string, meta?: any) => {
      console.log(message, meta ? " | " + JSON.stringify(meta) : "");
    };

    /**
     * Info log. Sends the logged information to the server too.
     * @param message {string} Log message.
     * @param meta {any} Optional meta object for additional debugs. following: { [fieldName: string]: any; }.
     */
    var logInfo = (message: string, meta?: any) => {
      printToConsole("INFO | " + new Date() + " | " + message, meta);
      socket.emit(constants.socketEvents.log.info, { message: message, meta: meta });
    };

    /**
     * Debug log. Sends the logged information to the server too.
     * @param message {string} Log message.
     * @param meta {any} Optional meta object for additional debugs. following: { [fieldName: string]: any; }.
     */
    var logDebug = (message: string, meta?: any) => {
      printToConsole("DBG  | " + new Date() + " | " + message, meta);
      socket.emit(constants.socketEvents.log.debug, { message: message, meta: meta });
    };

    /**
     * Error log. Sends the logged information to the server too.
     * @param message {string} Log message.
     * @param meta {any} Optional meta object for additional debugs. following: { [fieldName: string]: any; }.
     */
    var logError = (message: string, meta?: any) => {
      printToConsole("ERR  | " + new Date() + " | " + message, meta);
      socket.emit(constants.socketEvents.log.error, { message: message, meta: meta });
    };

    /**
     * Warning log. Sends the logged information to the server too.
     * @param message {string} Log message.
     * @param meta {any} Optional meta object for additional debugs. following: { [fieldName: string]: any; }.
     */
    var logWarning = (message: string, meta?: any) => {
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
