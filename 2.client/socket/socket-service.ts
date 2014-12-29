"use strict";
// we store the factory for the sockets into the gameshelf base application itself

module Socket {
  "use strict";
  
  declare var io: any;

  export var moduleName: string = "socket-service";
  export var factoryName: string = "socket";

  export function factory(socketFactory: any) {
    // TODO create type definition for socketFactory (angular-socket-io) and PR into DefinitelyTyped
    return socketFactory();
  };
};

// initiating the socket factory 
angular
  .module(Socket.moduleName)
  .factory(Socket.factoryName, [
      "socketFactory",
      Socket.factory
    ]);