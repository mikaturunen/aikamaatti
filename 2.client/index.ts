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
   * Module details for Angular to consume.
   */ 
  export var meta: MetaModule = {
    moduleName: "aikamaatti",
    configFunction: config
  };
};

// setup the angular application itself with the help of the browserify modules
angular
  .module(
    Aikamaatti.meta.moduleName, [
      // outside (bower) dependencies
      "ui.router", 
      "ui.bootstrap", 
      "btford.socket-io",
      // internal application browserify dependencies
      require("./socket/socket-service").meta.moduleName,
      require("./log/log-service").meta.moduleName,
      require("./reservations/reservations-controller").meta.moduleName
    ]
  )
  .config([
      "$stateProvider", "$urlRouterProvider", "$locationProvider", 
      Aikamaatti.meta.configFunction
    ]);
