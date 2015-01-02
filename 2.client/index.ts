"use strict";

var controllers: any[] = [
  require("./reservations/reservations-controller"),
  require("./employees/employees-controller")
];

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

    // iterate over the controller states and let them declare their own states and options
    controllers
      .map(controller => controller.state)
      .forEach((state: ControllerState) => { 
        $stateProvider.state(state.name, state.options); 
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
  .module(Aikamaatti.meta.moduleName, [
      // outside (bower) dependencies
      "ui.router", 
      "ui.bootstrap", 
      "btford.socket-io",
      "angularFileUpload"
    ]
    // declaring our services
    .concat(
      require("./socket/socket-service").meta.moduleName,
      require("./log/log-service").meta.moduleName
    )
    // declaring our controllers
    .concat( 
      controllers.map(controller => controller.meta.moduleName) 
    )
    // declaring our directives
    .concat(
    )
  )
  .config([
      "$stateProvider", "$urlRouterProvider", "$locationProvider", 
      Aikamaatti.meta.configFunction
    ]);
