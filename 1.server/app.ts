// first things first, loading the utility-events and as we load it, it hooks into the process events to monitor
import utilityEvents = require("./utilities/utility-events");
utilityEvents.hook();

import log = require("./log/log");
import eventCentral = require("./event-central/event-central");
import express = require("express");
import path = require("path");

// Example of adding dynamic http routes
import databaseRoutes = require("./database/database-routes");

var app = express();

app.use("/public", express.static(path.normalize(path.join(__dirname, "..", "client"))));

// Initialize the additional routes for route modules
databaseRoutes.init(app);

app.get("*", (req: any, res: any) => {
  var indexHtml: string = path.join(__dirname, "..", "client", "html", "index.html");
	res.sendFile(indexHtml);
});

// STARTING THE EXPRESS SERVER
// TODO read details from configuration file
var server = app.listen(3000, "127.0.0.1", () => {
	log.info("Server running.", { port: server.address().port });
});

eventCentral.init(server);

// Example of adding dynamic socket routes
import databaseSockets = require("./database/database-socket");
import employeesSockets = require("./employees/employees-socket");
// building an array out of the actual socket event descriptions - compile time check that we have all necessary
// functions in place
var socketEvents: SocketRouteDefinition[] = [ databaseSockets, employeesSockets ];
// hook all the events in place
socketEvents.forEach(socketEvent => socketEvent.init());



