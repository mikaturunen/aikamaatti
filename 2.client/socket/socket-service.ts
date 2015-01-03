"use strict";
// we store the factory for the sockets into the gameshelf base application itself

module Socket {
  "use strict";

  var factory = (socketFactory: any) => {
    // TODO create type definition for socketFactory (angular-socket-io) and PR into DefinitelyTyped
    return socketFactory();
  };

  /**
   * Module details for Angular to consume.
   */ 
  export var meta: MetaModule = {
    moduleName: "aikamaatti.socket-service",
    serviceName: "socket",
    serviceFunction: factory
  }
};

// initiating the socket factory 
angular
  .module(Socket.meta.moduleName, [ ])
  .factory(Socket.meta.serviceName, [
      "socketFactory",
      Socket.meta.serviceFunction
    ]);

export = Socket;
