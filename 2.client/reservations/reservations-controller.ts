"use strict";

module ReservationsController {
  // The actual controller function that takes in what dependencies were injected.
  // parameter list for the function always needs to match the injected object list in the below angular module setup
  // phase
  var controller = ($scope: ReservationsScope, socket: any, log: any) => {
    log.debug("Started Controller. ", ReservationsController.meta);
    defineScopeFunctions($scope);
  };

  // One place to define the functionality of the objects in the scope
  var defineScopeFunctions = ($scope: ReservationsScope) => {  
    
  };

  var name: string = "reservations";
  var controllerName: string = "ReservationsController";

  /**
   * ReservationsScope object for $scope usage.
   */
  export interface ReservationsScope extends ng.IScope {
    
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
      // ROOT CONTROLLER
      url: "/",
      templateUrl: "public/html/reservations/reservations.html",
      controller: controllerName
    }
  };
}

// Setup angular module, dependencies and behavior
angular
  .module(ReservationsController.meta.moduleName, [ ])
  .controller(ReservationsController.meta.controllerName, 
    [
      "$scope", "socket", "log",
      ReservationsController.meta.controllerFunction 
    ]);

// Controller module, check that it follows the interface declaration, in TSC1.3 there is not way of using a 
var reservationControllerIsOk: ControllerState = ReservationsController.state;

export = ReservationsController;
