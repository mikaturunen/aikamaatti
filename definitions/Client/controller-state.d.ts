
/**
 * Interface to implement for the angular ui router states so the controllers follow the given style
 */
interface ControllerState {
    /** 
     * Name of the state in the ui-router
     */
    name: string;

    /**
     * Options for the state, defining naming, templates and so on.
     */
    options: {
        templateUrl?: string;
        template?: string;
        url: string;
        controller: string;
    };
}
