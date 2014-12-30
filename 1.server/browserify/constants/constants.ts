"use strict";

/** 
 * @module Constants
 * Module for listing all constants, both client and server side. 
 */
module Constants {
    "use strict";

    /** 
     * Socket event related so we don't have to keep guessing the events.
     */
    export var socketEvents = {
        log: {
            info: "log.info",
            warning: "log.warn",
            error: "log.error",
            debug: "log.debug",
        },
        connected: "connection",
        disconnected: "disconnect"
    };

    /** 
     * List of supported logging levels by the aikamaatti logging system.
     */
    export var logLevels = {
        debug: "debug",
        warning: "warn", 
        error: "error",
        info: "info",
        trace: "trace"
    };

    export var environment = {
        variables: {
            production: "NODE_ENV"
        },
        defaults: {
            NODE_ENV: "development"
        }
    };
};

export = Constants;
