"use strict";

import events = require("events");
import log = require("../log/log");
// TODO type definitions/imports 
var socket = require("socket.io");

var emitter = new events.EventEmitter();
var io: any;

/**
 * @class EventCentral.
 * Used for centralized event communication inside the Aikamaatti application.
 */
module EventCentral {
    "use strict";
    // I felt like trying out something different and I created a centralized event handler 

    var eventHooks: { [eventName: string]: any[]; } = { };

    var addEventInit = (eventName: string, eventHandlerFunction: any) => {
        if (eventHooks[eventName] === undefined) {
            eventHooks[eventName] = [ ];
        }

        eventHooks[eventName].push(eventHandlerFunction);
    };

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

        // we have potentially collected socket events that need to be attached to the io object after it has been
        // created so the other modules can start receiving messages
        var eventNames: string[] = Object.keys(eventHooks);

        if (eventNames.length > 0) {
            log.info("Attaching buffered 'on' socket events in place... ");
            eventNames.forEach((key: string) => { 
                log.info("socket.on event handler attached.", { socketEventName: key });
                eventHooks[key].forEach(onEventCallback => { io.on(key, onEventCallback) });
            });
        }
    }

    /** 
     * Adds a new event listener for a socket event.
     * @param eventName {string} Name of the socket event to listen for.
     * @param eventHandlerFunction {any} Callback to call once the event triggers
     */
    export function addSocketEventListener(eventName: string, eventHandlerFunction: any) {
        if (!io) {
            console.log("JSON.stringify log " + log.debug + ", " + JSON.stringify(log.debug));
            log.debug("Socket.io not initiazed. Buffering event add.", { eventName: eventName });
            addEventInit(eventName, eventHandlerFunction);
            return;
        }

        io.on(eventName, eventHandlerFunction);
        log.info("Registered handler for socket.event", { eventName: eventName });
    }

    /** 
     * Adds a new event listener for an EventEmitter event.
     * @param eventName {string} Name of the socket event to listen for.
     * @param eventHandlerFunction {any} Callback to call once the event triggers
     */
    export function addEventListener(eventName: string, eventHandlerFunction: any) {
        emitter.on(eventName, eventHandlerFunction);
        log.info("Registered handler for event", { eventName: eventName });
    }

    /**
     * Removes a specific event listener
     */
    export function removeSocketEventListener(eventName: string, eventHandlerFunction: any) {

    }

    /** 
     * Removes a specific event listener
     */
    export function removeEventListener(eventName: string, eventHandlerFunction: any) {
    }

    /**
     * Emits message through the socket.io to client side.
     */
    export function emitSocket(eventName: string, params: any) {
        io.emit(eventName, params);
    }

    /**
     * Emits message through the encapsulated event emitter and stays on server side.
     */
    export function emit(eventName: string, params: any) {
        emitter.emit(eventName, params);
    }
}


export = EventCentral;
