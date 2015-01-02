
/**
 * Interface for Angular module injection and maintaining easier typing.
 */
interface MetaModule {
  /**
   * Name for the module. 
   */
  moduleName: string;

  /**
   * Optional controller name. If the module uses controller, should be used.
   */
  controllerName?: string;

  /** 
   * Optional service name. When part of service, this should be used.
   */
  serviceName?: string;

  /** 
   * Optional directive name. When part of directive, this should be used.
   */ 
  directiveName?: string;

  /**
   * Dependencies for the module. Used when creating the module.
   */
  dependencyList?: string[];

  /**
   * Optional angular.module.config callback function. 
   */
  configFunction?: (...args: any[]) => void;

  /** 
   * Completely optional list of dependencies for the module creation.
   */ 
  dependencies?: string[];

  /**
   * Optional angular.module.controller callback function.
   */
  controllerFunction?: (...args: any[]) => void;

  /** 
   * Optional angular.module.service/factory callback function.
   */
  serviceFunction?: (...args: any[]) => void;

  /** 
   *  Optional angular.module.directive callback function.
   */ 
  directiveFunction?: (...args: any[]) => void;
}
