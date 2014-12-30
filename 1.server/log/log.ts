"use strict";

import bunyan = require("bunyan");
import eventCentral = require("../event-central/event-central");

// creating logger for the normal aikamaatti issues
var log = bunyan.createLogger({
  name: "aikamaatti",
  stream: process.stdout,
  level: "debug"
});

// TODO report user who sent the events
// logger for Aikamaattis client side
var clientLogger = bunyan.createLogger({
  name: "client-aikamaatti",
  stream: process.stdout,
  level: "debug"
});

/** 
 * Writes the actual log to provided logger on provided level.
 * @params logger {bunyan.Logger} The actual Logger to use from bunyan
 * @params level {string} Log level. "debug", "error", "warn", "trace", "info"
 * @params message {string} Message to log.
 * @params meta {any} Optional. Meta information for Bunyan to use.
 */
var writeLog = (logger: bunyan.Logger, level: string, message: string, meta?: { [fieldName: string]: any; }) => {
  if (meta) {
    (<any>logger)[level](meta, message);
  } else {
    (<any>logger)[level](message);
  }
};

// I like my constants in big bulky and bold letters...
var DEBUG: string   = "debug";
var ERROR: string   = "error";
var WARNING: string = "warn";
var INFO: string    = "info";

/** 
 * @module Log
 * Module for handling logging in the node application. Internally uses Bunyan for managing logging behavior.
 */
module Log {
  "use strict";
  
  /** 
   * Connects the client side logging into the centralized event handling and eventually into the logging system
   * @params level {string} What level to log at.
   * @params message {string} Message to log.
   * @params meta {any} Optional. 
   */
  export function client(level: string, message: string, meta?: { [fieldName: string]: any; }) {
    writeLog(clientLogger, level, message, meta);
  }

  /** 
   * Debug log.
   * @params message {string} Message to log.
   * @params meta {any} Optional. 
   */
  export function debug(message: string, meta?: { [fieldName: string]: any; }) {
     writeLog(log, DEBUG, message, meta);
  }

  /** 
   * Info log.
   * @params message {string} Message to log
   * @params meta {any} Optional. 
   */
  export function info(message: string, meta?: { [fieldName: string]: any; }) {
    writeLog(log, INFO, message, meta);
  }

  /** 
   * Warning log.
   * @params message {string} Message to log.
   * @params meta {any} Optional. 
   */
  export function warn(message: string, meta?: { [fieldName: string]: any; }) {  
    writeLog(log, WARNING, message, meta);
  }

  /** 
   * Error log.
   * @params message {string} Message to log.
   * @params meta {any} Optional. 
   */
  export function error(message: string, meta?: { [fieldName: string]: any; }) {
    writeLog(log, ERROR, message, meta);
  }
};

export = Log;
