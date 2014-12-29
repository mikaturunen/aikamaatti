
import database = require("database");

/** 
 * @module DatabaseRoutes
 * Contains all HTTP routes for Database accessing. Implements HttpRouteDefinitions.
 */
module DatabaseRoutes {
  var routes: any = {
    /** 
     * GET hello world example
     * @param request {Express.Request} HTTP request object.
     * @param response {Express.Response} HTTP response object.
     */
    getHelloWorld: (request: Express.Request, response: Express.Response) => {
      // For now this example does nothing and is here just to server an example purpose of how slush-lolly generally
      // advices to inject into the Express routes in a controller manner.
      console.log("/hello/:world");
    }
  };

  // TODO type definitions for application
  /**
   * Initializes all Database specific HTTP routes in place.
   * @param application {any} Express application.
   */
  export function init(application: any) {
    // Example of how to dynamically inject routes into the slush-lollys Express context
    application.get("/hello/:world", routes.getHelloWorld);
  };
}

// This small block will throw error if the above module does not follow the strict HttpRouteDefinition interface :)
// In TypeScript Version 1.1.0.1 you still cannot force modules to follow/adhere interfaces, so we'll do it this way.
module interfaceCheck { var isOk: HttpRouteDefinition = DatabaseRoutes; }

export = DatabaseRoutes;
