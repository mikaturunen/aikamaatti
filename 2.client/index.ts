"use strict";

/**
 * Main angular module that initially configures routes in place and maintains order.
 */
module Aikamaatti {
  "use strict";
  
  /**
   * Configuration function for main module. 
   */ 
  var config = ($stateProvider: any, $urlRouterProvider: any, $locationProvider: any) => {
    // TODO: write types for the parameters to config

    $urlRouterProvider.otherwise("/")
    // we want the fully functional html5 mode (also removes the # -sign from the URL)
    $locationProvider.html5Mode(true);

    // Now set up the states
    $stateProvider
      .state("reservations", {
        url: "/",
        templateUrl: "public/html/reservations/reservations.html",
        controller: "ReservationsController"
      });
  };

  /** 
   * List of modules that are also dependencies and need to be created through angular.module
   */ 
  export var modules = [
    "socket-service",
    "reservations"
  ]; 

  /**
   * Module details for Angular to consume.
   */ 
  export var meta: MetaModule = {
    moduleName: "aikamaatti",
    configFunction: config,
    // list of dependencies Aikamaatti application depends on.
    dependencies: [ 
        // outside dependencies (through bower)
        "ui.router", "ui.bootstrap", "btford.socket-io", 
      ]
      .concat(modules)
  };
};

// Initialize the main module of our application
angular
  .module(Aikamaatti.meta.moduleName, Aikamaatti.meta.dependencies)
  .config([
      "$stateProvider", "$urlRouterProvider", "$locationProvider", 
      Aikamaatti.meta.configFunction
    ]);

// centralized initiation of the modules we are going to declare in other files.
// rationale: this js files gets included first -> declare all modules and initiate them
//            then in other js files we just call the modules and declare controllers, services and such for the
//            modules.
Aikamaatti.modules.forEach(angularModule => angular.module(angularModule, []));
