"use strict";

import Log = require("../log/log-service");
import Csv = require("../CSV/csv-service");

module EmployeesController {
  /**
   * EmployeesScope object for $scope usage.
   */
  export interface EmployeesScope extends ng.IScope {
    isEmployeeCreationHidden: boolean;  
    importEmployeesCsv: ($files: any[]) => void;    // exports a list of employees (including groups) from a csv 
                                                    // file
    importTreatmentsCsv: ($files: any[]) => void;   // exports a list of treatments from CSV file
  };

  // The actual controller function that takes in what dependencies were injected.
  // parameter list for the function always needs to match the injected object list in the below angular module setup
  // phase
  var controller = ($scope: EmployeesScope, socket: any, log: Log.Service, csv: Csv.Service) => {
    log.debug("Started Controller. ", EmployeesController.meta);
    defineScopeFunctions($scope, log, csv);
  };

  // One place to define the functionality of the objects in the scope
  var defineScopeFunctions = ($scope: EmployeesScope, log: Log.Service, csv: Csv.Service) => {  
    $scope.isEmployeeCreationHidden = true;

    $scope.importEmployeesCsv = ($files: any) => {
      log.debug("Exporting employees from CSV file.", { filesCount: $files.length });
      csv.importEmployees($files);
    };

    $scope.importTreatmentsCsv = ($files: any) => {
      log.debug("Exporting treatments from CSV file.", { filesCount: $files.length });
      csv.importTreatments($files);
    };
  };

  var name: string = "employees";
  var controllerName: string = "EmployeesController";

  /**
   * Module details for Angular to consume.
   */ 
  export var meta: MetaModule = {
    moduleName: name,
    controllerName: controllerName,
    controllerFunction: controller
  }

  /** 
   * Controller knows the details of it's implementation for the ui-router
   */
  export var state: ControllerState = {
    name: name,
    options: {
      url: "/employees",
      templateUrl: "public/html/employees/employees.html",
      controller: controllerName
    }
  };
}

// Setup angular module, dependencies and behavior
angular
  .module(EmployeesController.meta.moduleName, [ ])
  .controller(EmployeesController.meta.controllerName, 
    [
      "$scope", "socket", "log", "csv",
      EmployeesController.meta.controllerFunction 
    ]);

var employeesControllerIsOk: ControllerState = EmployeesController.state;

export = EmployeesController;
