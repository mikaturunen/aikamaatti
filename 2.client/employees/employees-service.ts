"use strict";

import Log = require("../log/log-service");
import Csv = require("../CSV/csv-service");
import constants = require("../../1.server/browserify/constants/constants");

// I'm using the node sides Q module here as oppose to Angulars $q (due to minor differences like .done() and the 
// fact that I'm also looking around for other modules besides Angular so I need to able to detach myself from Ang
// when I want to)
import Q = require("q");

/**  
 * Service module for manipulating everything Employees related.
 * @module Employees
 */ 
module Employees {
  export interface Service {
    add: (employees: EmployeeModel[]) => Q.Promise<EmployeeModel[]>;
  };

  var service = (socket: any, log: Log.Service) => {
    var add = (employees: EmployeeModel[]) : Q.Promise<EmployeeModel[]>=> {
      var deferred = <Q.Deferred<EmployeeModel[]>> Q.defer();

      log.info("Sending Employees to server.", { employeesCount: employees.length });
      socket.emit(constants.socketEvents.employees.add, employees);

      return deferred.promise;
    };

    return {
      add: add
    };
  };

  /**
   * Module details for Angular to consume.
   */ 
  export var meta: MetaModule = {
    moduleName: "aikamaatti.employees-service",
    serviceName: "employees-service",
    serviceFunction: service
  }
}

// Setup angular module, dependencies and behavior
angular
  .module(Employees.meta.moduleName, [ ])
  .service(Employees.meta.serviceName, 
    [
      "socket", "log", 
      Employees.meta.serviceFunction 
    ]);

export = Employees;
