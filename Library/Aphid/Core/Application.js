/**
 * class Aphid.Core.Application
 * 
 * Abstract class that should be subclassed by an application that wishes to
 * be managed by the Aphid framework.
 *
 * By subclassing this Aphid.Core.Application, your application delegate
 * automatically gains a logging instance and other pre-flight setup required
 * to bootstrap a new Aphid-based application instance.
 *
 * **Usage Example**
 * 
 *     var FooApplication = Class.create(Aphid.Core.Application, {
 *       initialize: function($super)
 *       {
 *         $super();
 *         this.logger.info("Initializing the Foo Application...", "FooApplication");
 *       }
 *     });
**/
Aphid.Core.Application = Class.create();

Aphid.Core.Application.prototype = {

  // Application Logging
  logLevel: Aphid.Support.Logger.DEBUG_LEVEL,
  logger: false,

  /**
   * new Aphid.Core.Application()
   * 
   * Initializes the Logger.
  **/
  initialize: function()
  {
    this._initializeLogger();
  },

  /*
   * Aphid.Core.Application#_initializeLogger() -> Aphid.Support.Logger
   *
   * Initializes a new Logger instances to be shared by the Application. The
   * Logger instance is accessible as Application.sharedInstance.logger as
   * well as the shortcut $L (i.e. $L.warn("Danger, Will Robinson! Danger!")).
   */
  _initializeLogger: function()
  {
    this.logger = new Aphid.Support.Logger(this.logLevel);
    $L = this.logger;
    return this.logger;
  }

};
