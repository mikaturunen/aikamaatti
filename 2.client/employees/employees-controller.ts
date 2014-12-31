"use strict";

module EmployeesController {
  // The actual controller function that takes in what dependencies were injected.
  // parameter list for the function always needs to match the injected object list in the below angular module setup
  // phase
  var controller = ($scope: EmployeesScope, socket: any, log: any) => {
    log.debug("Started Controller. ", EmployeesController.meta);
    defineScopeFunctions($scope);
  };

  // One place to define the functionality of the objects in the scope
  var defineScopeFunctions = ($scope: EmployeesScope) => {  
    
  };

  var name: string = "employees";
  var controllerName: string = "EmployeesController";

  /**
   * EmployeesScope object for $scope usage.
   */
  export interface EmployeesScope extends ng.IScope {
    
  };

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
      "$scope", "socket", "log",
      EmployeesController.meta.controllerFunction 
    ]);

var employeesControllerIsOk: ControllerState = EmployeesController.state;

export = EmployeesController;
