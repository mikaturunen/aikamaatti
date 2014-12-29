// first things first, loading the utility-events and as we load it, it hooks into the process events to monitor
import utilityEvents = require("./utilities/utility-events");
utilityEvents.hook();

import log = require("./log/log");
import eventCentral = require("./event-central/event-central");
import express = require("express");
import path = require("path");


// Example of adding dynamic http routes
import databaseRoutes = require("./database/database-routes");
// Example of adding dynamic socket routes
import databaseSockets = require("./database/database-socket");
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
	log.debug("Server running.", { port: server.address().port });
});

eventCentral.init(server);
eventCentral.addSocketEventListener("log.debug", (o: any, o1: any, o2: any) => { console.log("DEBUG: ", o, o1, o2); });
eventCentral.addSocketEventListener("log.info", (o: any, o1: any, o2: any) => { console.log("INFO: ", o, o1, o2); });
eventCentral.addSocketEventListener("log.warn", (o: any, o1: any, o2: any) => { console.log("WARN: ", o, o1, o2); });
eventCentral.addSocketEventListener("log.error", (o: any, o1: any, o2: any) => { console.log("ERROR: ", o, o1, o2); });

// applying dynamic routes to the socket server
databaseSockets.init();


