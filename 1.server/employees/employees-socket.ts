"use strict";

import constants = require("../browserify/constants/constants");
import log = require("../log/log");
import eventCentral = require("../event-central/event-central");
import employeesCollection = require("./employees");
import utilities = require("../utilities/utility-events");

module EmployeesSocket {
    "use strict";

    /** 
     * List of events manipulated or hooked in place.
     */
    var events = {
        /**
         *
         */
        add: (socket: SocketIO.Socket, employees: EmployeeModel[], socketCallback: (error: any, result?: any) => void
            ) => {

            if (!employees || employees.length <= 0) {
                log.warn("Sent 0 employees to server for creation.");
                return;
            }

            log.debug("Starting to create Employees.", { employeeCount: employees.length });
            
            employeesCollection
                .add(employees)
                .then((results: EmployeeModel[]) => { socketCallback(null, results); })
                .catch((error: any) => { utilities.handleServerErrorToClient(error, socketCallback); })
                .done();
        }
    };

    /** 
     * Hooks set of Employees related socket messages in place.
     */
    export function init() {
        employeesCollection.init();

        eventCentral.addSocketEventListener(constants.socketEvents.employees.add, events.add);
    }
}

export = EmployeesSocket;
