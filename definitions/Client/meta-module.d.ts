
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
   * Dependencies for the module. Used when creating the module.
   */
  dependencyList?: string[];

  /**
   * Optional angular.module.config callback function. 
   */
  configFunction?: (...args: any[]) => void;

  /**
   * Optional angular.module.controller callback function.
   */
  controllerFunction?: (...args: any[]) => void;

  /** 
   * Optional angular.module.service/factory callback function.
   */
  serviceFunction?: (...args: any[]) => void;
}
