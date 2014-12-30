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

  /**
   * ReservationsScope object for $scope usage.
   */
  export interface ReservationsScope extends ng.IScope {
    
  };

  /**
   * Module details for Angular to consume.
   */ 
  export var meta: MetaModule = {
    moduleName: "reservations",
    controllerName: "ReservationsController",
    controllerFunction: controller
  }
}

// Setup angular module, dependencies and behavior
angular
  .module(ReservationsController.meta.moduleName, [ ])
  .controller(ReservationsController.meta.controllerName, 
    [
      "$scope", "socket", "log",
      ReservationsController.meta.controllerFunction 
    ]);

export = ReservationsController;
