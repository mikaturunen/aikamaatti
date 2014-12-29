import bunyan = require("bunyan");

// creating logger for the normal aikamaatti issues
var log = bunyan.createLogger({
    name: "aikamaatti",
    stream: process.stdout,
    level: "debug"
});

/** 
 * @module Log
 * Module for handling logging in the node application. Internally uses Bunyan for managing logging behavior.
 */
module Log {
  /** 
   * Info log.
   * @params message {string} Message to log
   * @params argument {any} Optional. 
   */
  export function info(message: string, meta?: { [fieldName: string]: any; }) {
    if (meta) {
      log.info(meta, message); 
    } else {
      log.info(message);
    }
  }

  /** 
   * Warning log.
   * @params message {string} Message to log.
   * @params argument {any} Optional. 
   */
  export function warn(message: string, meta?: { [fieldName: string]: any; }) {  
    if (meta) {
      log.warn(meta, message); 
    } else {
      log.warn(message);
    }
  }

  /** 
   * Error log.
   * @params message {string} Message to log.
   * @params argument {any} Optional. 
   */
  export function error(message: string, meta?: { [fieldName: string]: any; }) {
    if (meta) {
      log.error(meta, message); 
    } else {
      log.error(message);
    }
  }

  /** 
   * Debug log.
   * @params message {string} Message to log.
   * @params argument {any} Optional. 
   */
  export function debug(message: string, meta?: { [fieldName: string]: any; }) {
    if (meta) {
      log.debug(meta, message); 
    } else {
      log.debug(message);
    }
  }
}

export = Log;
