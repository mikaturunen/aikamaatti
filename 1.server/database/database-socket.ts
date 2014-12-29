import database = require("database");

/** 
 * @module DatabaseSocket
 * Contains all socket routes for Database accessing. Implements SocketRouteDefinition.
 */
module DatabaseSocket {
  var events: any = {
    /**
     * Hello world socket event message
     */
    helloWorld: {
      message: "slush.hello.world",
      fn: (socket: any) => {
        console.log("Socket: Hello World!");
      }
    }
  };

  // TODO typedefinitions for socket.io
  /** 
   * Hooks set of Database related socket messages in place.
   * @param io {any} socket.io object.
   */
  export function init(io: any) {
    // Example of dynamically hooking the socket messages in place in slush-lolly
    io.on(events.helloWorld.message, events.helloWorld.fn);
  }
}

// This small block will throw error if the above module does not follow the strict HttpRouteDefinition interface :)
// In TypeScript Version 1.1.0.1 you still cannot force modules to follow/adhere interfaces, so we'll do it this way.
module interfaceCheck { var isOk: SocketRouteDefinition = DatabaseSocket; }

export = DatabaseSocket;
