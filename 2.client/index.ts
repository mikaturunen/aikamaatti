
/**
 * Main angular module that initially configures routes in place and maintains order.
 */
module GameShelf {
  /**
   * Name of the main module.
   */
  export var name: string = "aikamaatti";

  /**
   * Dependencies for the main module.
   */
  export var depends: string[] = [ "ui.router", "ui.bootstrap", "btford.socket-io", "gallery" ];

  /**
   * Configuration function for main module. 
   */ 
  export function config($stateProvider: any, $urlRouterProvider: any, $locationProvider: any) {
    // TODO: write types for the parameters to config

    $urlRouterProvider.otherwise("/")
    // we want the fully functional html5 mode (also removes the # -sign from the URL)
    $locationProvider.html5Mode(true);

    // Now set up the states
    $stateProvider
      .state("gallery", {
        url: "/",
        templateUrl: "public/html/gallery/gallery.html",
        controller: "GalleryController"
      });
  }
};

// Initialize the main module of our application
angular
  .module(GameShelf.name, GameShelf.depends)
  .config([
      "$stateProvider", "$urlRouterProvider", "$locationProvider", 
      GameShelf.config
    ]);

// centralized initiation of the modules we are going to declare in other files.
// rationale: this js files gets included first -> declare all modules and initiate them
//            then in other js files we just call the modules and declare controllers, services and such for the
//            modules.
angular
  .module("gallery", [ ]);