"use strict";
define(["require", "exports"], function (require, exports) {
    /**
     * @module Constants
     * Module for listing all constants, both client and server side.
     */
    var Constants;
    (function (Constants) {
        "use strict";
        /**
         * Socket event related so we don't have to keep guessing the events.
         */
        Constants.socketEvents = {
            log: {
                info: "log.info",
                warning: "log.warn",
                error: "log.error",
                debug: "log.debug"
            },
            connected: "connection",
            disconnected: "disconnect"
        };
        /**
         * List of supported logging levels by the aikamaatti logging system.
         */
        Constants.logLevels = {
            debug: "debug",
            warning: "warn",
            error: "error",
            info: "info",
            trace: "trace"
        };
        Constants.environment = {
            variables: {
                production: "NODE_ENV"
            },
            defaults: {
                NODE_ENV: "development"
            }
        };
    })(Constants || (Constants = {}));
    ;
    return Constants;
});
