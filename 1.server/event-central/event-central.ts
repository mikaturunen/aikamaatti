"use strict";

import events = require("events");
import log = require("../log/log");
// TODO type definitions/imports 
var socket = require("socket.io");

var emitter: any;
var io: any;

/**
 * @class EventCentral.
 * Used for centralized event communication inside the Aikamaatti application.
 */
module EventCentral {
    "use strict";

    // creating the actual emitter
    emitter = new events.EventEmitter();

    /**
     * Socket events reported to the event central for handling
     */
    var socketEvents: { [eventName: string]: any[]; } = { };

    /** 
     * List of connected socket clients
     */
    var sockets: any[] = [ ];

    var storeSocketEvent = (eventName: string, eventHandlerFunction: any) => {
        if (socketEvents[eventName] === undefined) {
            socketEvents[eventName] = [ ];
        }

        log.info("Event added to centralized event handling for sockets.", { eventName: eventName });
        socketEvents[eventName].push(eventHandlerFunction);
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
            log.debug("Socket connected to server.", { id: socket.id, connectedSockets: sockets.length });
            sockets.push(socket);

            // add all specific events to this socket
            Object.keys(socketEvents).forEach((key: string) => { 
                log.debug("Event added to socket.", { eventName: key, id: socket.id });
                socketEvents[key].forEach((onEventCallback: any) => { socket.on(key, onEventCallback) });
            });

            socket.on("disconnect", () => {
                log.debug("Socket disconnected from server.", { id: socket.id });
                var index: number = sockets.indexOf(socket);

                if (index !== -1) {
                    log.debug("Removed socket from follow list.", { id: socket.id, connectedSockets: sockets.length });
                    sockets.splice(index, 1);
                }
            });
        });
    }

    /** 
     * Adds a new event listener for a socket event.
     * @param eventName {string} Name of the socket event to listen for.
     * @param eventHandlerFunction {any} Callback to call once the event triggers
     */
    export function addSocketEventListener(eventName: string, eventHandlerFunction: any) {
        storeSocketEvent(eventName, eventHandlerFunction);

        if (io) {
            sockets.forEach((socket: any) => { socket.on(eventName, eventHandlerFunction); });
            log.info("Registered handler for socket.event", { eventName: eventName });
        }
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
