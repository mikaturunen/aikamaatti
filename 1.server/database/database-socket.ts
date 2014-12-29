"use strict";

import database = require("database");
import eventCentral = require("../event-central/event-central");

/** 
 * @module DatabaseSocket
 * Contains all socket routes for Database accessing. Implements SocketRouteDefinition.
 */
module DatabaseSocket {
  "use strict";
  var events = {
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

  /** 
   * Hooks set of Database related socket messages in place.
   */
  export function init() {
    eventCentral.addSocketEventListener(events.helloWorld.message, events.helloWorld.fn);
  }
}

// This small block will throw error if the above module does not follow the strict HttpRouteDefinition interface :)
// In TypeScript Version 1.1.0.1 you still cannot force modules to follow/adhere interfaces, so we'll do it this way.
module interfaceCheck { var isOk: SocketRouteDefinition = DatabaseSocket; }

export = DatabaseSocket;
