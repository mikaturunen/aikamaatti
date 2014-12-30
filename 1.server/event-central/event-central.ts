"use strict";

import events = require("events");
import log = require("../log/log");
import socket = require("socket.io");

var emitter: NodeJS.EventEmitter;
var io: SocketIO.Server;

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
    var sockets: SocketIO.Socket[] = [ ];

    /** 
     * Stores the socket events.
     * @param eventName {string} Name of the event to listen for
     * @param eventHandlerFunction {any} Callback for handling the event.
     */ 
    var storeSocketEvent = (eventName: string, eventHandlerFunction: any) => {
        if (socketEvents[eventName] === undefined) {
            socketEvents[eventName] = [ ];
        }

        log.debug("Event added to centralized event handling for sockets.", { eventName: eventName });
        socketEvents[eventName].push(eventHandlerFunction);
    };
    
    // TODO type server object from Express
    /** 
     * Initializes the socket comunication.
     * @param server {any} Server object from Express
     */
    var initSocket = (server: any) => {
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
    };

    /** 
     * Connects client log-service to the Bunyan logging system on the backend so we can have shared logs.
     */ 
    var connectClientLogging = () => {
        // connect client side logging into the log system
        addSocketEventListener("log.debug", (parameters: any) => { 
            log.client("debug", parameters.message, parameters.meta); 
        });

        addSocketEventListener("log.info", (parameters: any) => { 
            log.client("info", parameters.message, parameters.meta); 
        });

        addSocketEventListener("log.warn", (parameters: any) => { 
            log.client("warn", parameters.message, parameters.meta); 
        });

        addSocketEventListener("log.error", (parameters: any) => { 
            log.client("error", parameters.message, parameters.meta); 
        });
    };

    /** 
     * Initializes the event handling central and starts listening for socket messages.
     */    
    export function init(server: any) {
        if (io !== undefined) {
            return;
        }

        log.debug("Initializing socket.io for use.");
        initSocket(server);
        connectClientLogging();
    }

    /** 
     * Adds a new event listener for a socket event.
     * @param eventName {string} Name of the socket event to listen for.
     * @param eventHandlerFunction {any} Callback to call once the event triggers
     */
    export function addSocketEventListener(eventName: string, eventHandlerFunction: any) {
        storeSocketEvent(eventName, eventHandlerFunction);

        if (sockets.length > 0) {
            sockets.forEach((socket: any) => { socket.on(eventName, eventHandlerFunction); });
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
