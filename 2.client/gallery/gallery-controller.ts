
module GalleryController {
  // The actual controller function that takes in what dependencies were injected.
  // parameter list for the function always needs to match the injected object list in the below angular module setup
  // phase
  var controller = ($scope: CollectionScope, socket: any, log: any) => {
    log.debug("Started GalleryController.");
    defineScopeFunctions($scope);
  };

  // One place to define the functionality of the objects in the scope
  var defineScopeFunctions = ($scope: CollectionScope) => {  
    $scope.test = () : void => {
      
    };
  };

  /**
   * CollectionScope object for $scope usage.
   */
  export interface CollectionScope extends ng.IScope {
    test: () => void;
  };

  /**
   * Module details for Angular to consume.
   */ 
  export var meta: MetaModule = {
    moduleName: "gallery",
    controllerName: "GalleryController",
    controllerFunction: controller
  }
}

// Setup angular module, dependencies and behavior
angular
  .module(GalleryController.meta.moduleName)
  .controller(GalleryController.meta.controllerName, 
    [
      "$scope", "socket", "log",
      GalleryController.meta.controllerFunction 
    ]);