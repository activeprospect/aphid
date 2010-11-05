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
 * ### Usage Example
 * 
 *     var Application = Class.create(Aphid.Core.Application, {
 *       initialize: function($super)
 *       {
 *         $super();
 *         this.logger.info("Initializing the Foo Application...", "Application");
 *       }
 *     });
 *
 * ### Default Initialization
 *
 * If you do not create your own subclass of Aphid.Core.Application, a default
 * instance will be initialized for you.
 *
**/

var Application;

Aphid.Core.Application = Class.create({

  displayName: "Aphid.Core.Application",

  /**
   * Aphid.Core.Application#logger -> Aphid.Support.Logger | false
   *
   * A global, shared instance of [[Aphid.Support.Logger]].
  **/
  logger: false,

  /**
   * Aphid.Core.Application#logLevel -> Integer
   *
   * The default log level to be used by the global, shared instance of
   * [[Aphid.Support.Logger]].
  **/
  logLevel: Aphid.Support.Logger.DEBUG_LEVEL,

  /**
   * Aphid.Core.Application#notificationCenter -> Aphid.Core.NotificationCenter | false
   *
   * A global, shared instance of [[Aphid.Core.NotificationCenter]].
  **/
  notificationCenter: false,

  /**
   * Aphid.Core.Application#loadingIndicator -> Aphid.Support.LoadingIndicator | false
   *
   * A global, shared instance of [[Aphid.Support.LoadingIndicator]].
  **/
  loadingIndicator: false,

  /**
   * Aphid.Core.Application#mainWindow -> Aphid.UI.Window | false
   *
   * An instance of [[Aphid.UI.Window]] that represents the current document
   * body.
  **/
  mainWindow: false,

  /**
   * Aphid.Core.Application#baseViewPath -> String | false
   *
   * The base view path (or URL) that view templates should be loaded from,
   * by default.
  **/
  baseViewPath: false,

  /**
   * new Aphid.Core.Application()
   *
   * Initializes the Logger.
  **/
  initialize: function()
  {
    this._initializeLogger();
    this._initializeNotificationCenter();
    this._initializeLoadingIndicator();
    this.mainWindow = new Aphid.UI.Window();
    this.baseViewPath = "Resources/Templates";
  },

  /**
   * Aphid.Core.Application#applicationDidFinishInitialization() -> null
   *
   * This callback is triggered after the Application instance has been
   * initialized and can be overloaded in your subclass to perform any actions
   * that need to be performed after initialization has completed.
  **/
  applicationDidFinishInitialization: function()
  {

  },

  /*
   * Aphid.Core.Application#_initializeLogger() -> Aphid.Support.Logger
   *
   * Initializes a new Logger instance to be shared by the Application. The
   * Logger instance is accessible as Application.sharedInstance.logger as
   * well as the shortcut $L (i.e. $L.warn("Danger, Will Robinson! Danger!")).
   */
  _initializeLogger: function()
  {
    this.logger = new Aphid.Support.Logger(this.logLevel);
    return this.logger;
  },

  /*
   * Aphid.Core.Application#_initializeNotificationCenter() -> Aphid.Support.NotificationCenter
   *
   * Initializes a new NotificationCenter instance to be shared by the
   * Application. The NotificationCenter instance is accessible as
   * Application.sharedInstance.notificationCenter.
   */
  _initializeNotificationCenter: function()
  {
    this.notificationCenter = new Aphid.Core.NotificationCenter();
    return this.notificationCenter;
  },

  /*
   * Aphid.Core.Application#_initializeLoadingIndicator() -> Aphid.UI.LoadingIndicator
   *
   * Initializes a new LoadingIndicator instance to be shared by the
   * application.
   */
  _initializeLoadingIndicator: function()
  {
    this.loadingIndicator = new Aphid.UI.LoadingIndicator();
    Ajax.Responders.register({
      onCreate:   this.loadingIndicator.show.bind(this.loadingIndicator),
      onComplete: this.loadingIndicator.hide.bind(this.loadingIndicator)
    });
    return this.loadingIndicator;
  }

});

// Mixins --------------------------------------------------------------------

Object.extend(Aphid.Core.Application.prototype, Aphid.Support.Properties);

/*
 * Aphid.Core.Application.bootstrap() -> null
 *
 * Initializes the application delegate (an instance of Application that
 * subclasses [[Aphid.Core.Application]] or a default instance of
 * [[Aphid.Core.Application]] if a custom subclass does not exist).
 *
 * This method should be called after the DOM has been loaded and should never
 * be called directly by your application.
**/
Aphid.Core.Application.bootstrap = function()
{

  // If the user is using IE6, send them to the unsupported page...
  // TODO Expand this to a blacklist so that we can blacklist early Firefox and others
  if (Prototype.Browser.IE6)
  {
    window.location.href = "Vendor/Aphid/Resources/Templates/Unsupported.html";
    return
  }

  if (Object.isUndefined(Application))
  {
    $L.warn("Initializing a default application delegate as 'Application' ... You should define your own Aphid.Core.Application subclass.", this);
    Application = Class.create(Aphid.Core.Application);
  }
  Application.sharedInstance = new Application();
  $AppDelegate = Application.sharedInstance;
  if (!Object.isUndefined($AppDelegate.applicationDidFinishInitialization))
    $AppDelegate.applicationDidFinishInitialization();
}
document.observe('dom:loaded', Aphid.Core.Application.bootstrap);
