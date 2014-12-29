"use strict";

import events = require("events");
import log = require("../log/log");
// TODO type definitions/imports 
var socket = require("socket.io");

var emitter = new events.EventEmitter();

/**
 * @class EventCentral.
 * Used for centralized event communication inside the Aikamaatti application.
 */
module EventCentral {
    "use strict";
    // I felt like trying out something different and I created a centralized event handler 

    var io: any;

    /** 
     * Initializes the event handling central and starts listening for socket messages.
     */    
    export function init(server: any) {
        if (io !== undefined) {
            return;
        }

        log.debug("Initializing socket.io for use.");

        // TODO socket.io type definitions
        io = socket(server);
        io.on("connection", (socket: any) => {
          log.debug("Socket connected to server.");
        });
    }

    /** 
     * Adds a new event listener for a socket event.
     * @param eventName {string} Name of the socket event to listen for.
     * @param eventHandlerFunction {any} Callback to call once the event triggers
     */
    export function addSocketEventListener(eventName: string, eventHandlerFunction: any) {
        if (!io) {
            log.debug("Socket.io not initiazed");
            // making sure the storage is working as it should
            throw "Socket.io not initialized. Call init(server).";
        }

        io.on(eventName, eventHandlerFunction);
        log.info("Registered handler for event", { eventName: eventName });
    }

    /**
     * Removes a specific event listener
     */
    export function removeSocketEventListener(eventName: string, eventHandlerFunction: any) {

    }
}

export = EventCentral;
