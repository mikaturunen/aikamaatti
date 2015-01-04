// first things first, loading the utility-events and as we load it, it hooks into the process events to monitor
// potential crashes and uncaught exceptions
import utilityEvents = require("./utilities/utility-events");
utilityEvents.hook();

// COMMON 
import log = require("./log/log");
import eventCentral = require("./event-central/event-central");
import express = require("express");
import path = require("path");
import Q = require("q");
import http = require("http");

// DATABASE CONNECTIONS
import database = require("./database/database");

// HTTP ROUTES
import databaseRoutes = require("./database/database-routes");

// SOCKET EVENTS
import databaseSockets = require("./database/database-socket");
import employeesSockets = require("./employees/employees-socket");

// NOTE All the below functions are written into Q.Promise format even though most of them are synchronous,
//      this is for future references and to allow easier and more cleaner execution through promise chains.
//      Not all of the methods are synchronous so it made sense to wrap all of them and just execute a single promise
//      chain.

var generateDefaultExpress = () => {
    log.info("Setting up default Express application");
    var deferred = <Q.Deferred<express.Application>> Q.defer();

    var app = express();
    app.use("/public", express.static(path.normalize(path.join(__dirname, "..", "client"))));
    deferred.resolve(app);

    return deferred.promise;
};

var setHttpRoutes = (app: express.Application) => {
    log.info("Setting up HTTP routes.");
    var deferred = <Q.Deferred<express.Application>> Q.defer();

    // building an array out of the actual http route descriptions - compile time check that we have all necessary
    // functions in place
    var httpRoutes: HttpRouteDefinition[] = [ databaseRoutes ];
    httpRoutes.forEach(httpRoute => httpRoute.init(app));

    // From all other routes we return index.html for now... 
    app.get("*", (req: any, res: any) => {
      var indexHtml: string = path.join(__dirname, "..", "client", "html", "index.html");
        res.sendFile(indexHtml);
    });

    deferred.resolve(app);

    return deferred.promise;
};

var openDatabaseConnections = (app: express.Application) => {
    log.info("Setting up database connections.");
    var deferred = <Q.Deferred<express.Application>> Q.defer();

    database
        .init()
        .then(() => deferred.resolve(app))
        .catch(deferred.reject)
        .done();

    return deferred.promise;
};

var startExpressServer = (app: express.Application) => {
    log.info("Starting up Express.");
    var deferred = <Q.Deferred<http.Server>> Q.defer();

    // TODO read details from configuration file
    var server = app.listen(3000, "127.0.0.1", () => {
        log.info("Server running.", { port: server.address().port });
    });

    deferred.resolve(server);

    return deferred.promise;
};

var setSocketEvents = (server: http.Server) => {
    log.info("Setting up Socket events.");
    var deferred = <Q.Deferred<http.Server>> Q.defer();

    eventCentral.init(server);
    // building an array out of the actual socket event descriptions - compile time check that we have all necessary
    // functions in place
    var socketEvents: SocketRouteDefinition[] = [ databaseSockets, employeesSockets ];
    // hook all the events in place
    socketEvents.forEach(socketEvent => socketEvent.init());
    deferred.resolve(server);

    return deferred.promise;
};

var errorStartingApplication = (error: any) => {
    log.error(error);
    process.exit(1);
};

// execute the chain and run the application
generateDefaultExpress()
    .then(app => setHttpRoutes(app))
    .then(app => openDatabaseConnections(app))
    .then(app => startExpressServer(app))
    .then(server => setSocketEvents(server))
    .catch(errorStartingApplication)
    .done();




