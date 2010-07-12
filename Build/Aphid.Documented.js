/*
 * Aphid Framework
**/

/**
 * ==Aphid Framework==
 *
 * The Aphid namespace is the main container for the various Aphid frameworks
 * and contains other metadata for Aphid, including version.
 *
 * Aphid is a lightweight framework for modern web applications that utilize
 * new and emerging standards, such as HTML5 and CSS3. The framework also
 * attempts to degrade gracefully for older browsers, where possible.
 *
 * The design of Aphid was heavily influenced by the delegate and notification
 * patterns of Cocoa and Cocoa Touch and much of the view stack mimicks that
 * of UIKit from the iPhone SDK. The overall goal of Aphid, however, is to
 * create just a very thin layer on top of HTML and CSS so that we're able to
 * take full advantage of the flexibility of those technologies while simply
 * assisting the developer in compartmentalizing the behavioral aspects of
 * their application.
 *
**/

/** section: Aphid Framework
 * Aphid
**/
var Aphid = {

  /**
   * Aphid.Version = "1.0.0-alpha"
   *
   * The version number for Aphid in the *major.minor.build* format *(e.g. 1.0.123)*.
  **/
  Version: '1.0.0-alpha'

};

/**
 * Aphid.Support
 *
 * Contains common support code that is used by Aphid Core, Aphid UI and any
 * application that is based on the Aphid framework and libraries.
**/

Aphid.Support = {};

/**
 * Aphid.Support.Compatibility
 *
 * Compatibility code to bring emerging standards support to legacy browsers,
 * such as Internet Explorer.
**/

Aphid.Support.Compatibility = {};

/**
 * class Aphid.Support.Compatibility.HTML5
 *
 * Compatibility code to bring emerging standards support to legacy browsers,
 * such as Internet Explorer.
**/

Aphid.Support.Compatibility.HTML5 = {

  /**
   * Aphid.Support.Compatibility.HTML5.Elements = [ 'abbr', 'article', 'aside', 'audio', 'canvas', 'details', 'figcaption', 'figure', 'footer', 'header', 'hgroup', 'mark', 'meter', 'nav', 'output', 'progress', 'section', 'summary', 'time', 'video' ]
   *
   * An Array containing the names of each of the elements found in the HTML5
   * specification.
   *
   * `abbr` `article` `aside` `audio` `canvas` `details` `figcaption` `figure`
   * `footer` `header` `hgroup` `mark` `meter` `nav` `output` `progress`
   * `section` `summary` `time` `video`
  **/
  Elements: [
    'abbr', 'article', 'aside', 'audio', 'canvas', 'details', 'figcaption',
    'figure', 'footer', 'header', 'hgroup', 'mark', 'meter', 'nav', 'output',
    'progress', 'section', 'summary', 'time', 'video'
  ],

  /**
   * Aphid.Support.Compatibility.HTML5.createHTML5Elements() -> null
   *
   * Iterates the `Aphid.Support.Compatibility.HTML5_ELEMENTS` array, creating a
   * new element in the document for each, using `document.createElement(...)`.
  **/
  createElements: function()
  {
    this.Elements.each(this._createHTML5Element);
  },

  _createElement: function(elementName)
  {
    document.createElement(element);
  }

}
//
// Add support to the browser for the new HTML5 tags. Without this, Internet
// Explorer will not apply any styles to tags it does not recognize.
//
if (Prototype.Browser.IE)
  Aphid.Support.Compatibility.HTML5.createHTML5Elements();
/**
 * Aphid.Support.Compatibility.String
**/

Aphid.Support.Compatibility.String = {}

/**
 * mixin Aphid.Support.Compatibility.String.Trim
 *
 * Adds the *trim()*, *trimLeft()* and *trimRight()* methods to the String
 * class for legacy browsers that do not define these methods.
**/
Aphid.Support.Compatibility.String.Trim = {

  /**
   * Aphid.Support.Compatibility.String.Trim#trim() -> String
   *
   * Trims any leading and trailing whitepace from the string.
   *
   * **Example**
   *
   *     "  Foo Bar  ".trim()
   *     // => "Foo Bar"
   *
  **/
  trim: function()
  {
    return this.replace(/^\s+|\s+$/g,"");
  },

  /**
   * Aphid.Support.Compatibility.String.Trim#trimLeft() -> String
   *
   * Trims any leading whitepace from the string.
   *
   * **Example**
   *
   *     "  Foo Bar  ".trimLeft()
   *     // => "Foo Bar  "
   *
  **/
  trimLeft: function()
  {
    return this.replace(/^\s+/,"");
  },

  /**
   * Aphid.Support.Compatibility.String.Trim#trimRight() -> String
   *
   * Trims any trailing whitepace from the string.
   *
   * **Example**
   *
   *     "  Foo Bar  ".trimRight()
   *     // => "  Foo Bar"
   *
  **/
  trimRight: function()
  {
    return this.replace(/\s+$/,"");
  }

}

//
// Extend the String class only for browsers that do not already define the
// *trim()* method on String.
//
if (Object.isUndefined("".trim))
  Object.extend(String.prototype, Aphid.Support.Compatibility.String.TrimSupport);
/**
 * Aphid.Support.Extensions
 *
 * Extentions to the core JavaScript engine as well as vendored, 3rd-party
 * libraries.
**/

Aphid.Support.Extensions = {};

/**
 * Aphid.Support.Extensions.Vendor
 *
 * Extensions to 3rd-party JavaScript libraries and frameworks, such as
 * Prototype and script.aculo.us.
 *
**/

Aphid.Support.Extensions.Vendor = {};

/**
 * Aphid.Support.Extensions.Vendor.Prototype
 *
 * Custom extensions to the Prototype framework.
**/

Aphid.Support.Extensions.Vendor.Prototype = {};

/**
 * mixin Aphid.Support.Extensions.Vendor.Prototype.Element
**/

Aphid.Support.Extensions.Vendor.Prototype.Element = {

  /**
   * Aphid.Support.Extensions.Vendor.Prototype.Element#fromString(htmlString) -> Element
   *
   * - htmlString (String): an HTML-formatted string with a single outer
   *   element.
   *
   * Returns a new Element instance from an HTML string.  This is primarily
   * useful for accessing the result of a Template evaluation that returns an
   * HTML snippet before adding the snippet to the DOM.
   *
   * **Example**
   *
   *     var myElement = Element.fromString('<div class="new">Foo</div>');
   *     // => Element
   *
  **/
  fromString: function(string)
  {
    return new Element('div').update(string.trim()).firstChild;
  }

};

Object.extend(Element, Aphid.Support.Extensions.Vendor.Prototype.Element);

/**
 * mixin Aphid.Support.Extensions.Vendor.Prototype.Element.Methods
**/
Aphid.Support.Extensions.Vendor.Prototype.Element.Methods = {

  /**
   * Aphid.Support.Extensions.Vendor.Prototype.Element.Methods#insert -> Element
   *
   * Adds support for inserting an Array of Elements
  **/
  insert: Element.insert.wrap(
    function(insert, element, insertation)
    {
      if (!Object.isArray(insertation))
        return insert(element, insertation);

      element = $(element);
      insertation.each(insert.curry(element));
      return element;
    }
  )

};

Element.addMethods(Aphid.Support.Extensions.Vendor.Prototype.Element.Methods);
/**
 * Aphid.Support.Extensions.Object
 *
 * Extensions to the core JavaScript Object implementation.
**/
Aphid.Support.Extensions.Object = {

  /**
   * Aphid.Support.Extensions.Object.isEvent() -> Boolean
   *
   * Returns true if the object is an Event (i.e. MouseEvent, KeyEvent, etc).
  **/
  isEvent: function(object)
  {
    return Object.isArray(object.toString().match('Event'));
  }

}

Object.extend(Object, Aphid.Support.Extensions.Object);
/**
 * Aphid.Support.Extensions.String
 *
 * Extensions to the core JavaScript String implementation.
 *
**/
Aphid.Support.Extensions.String = {

  /**
   * Aphid.Support.Extensions.String#lowerCaseFirst() -> String
  **/
  lowerCaseFirst: function()
  {
    return this.charAt(0).toLowerCase() + this.substring(1);
  },

  /**
   * Aphid.Support.Extensions.String#toInt() -> Number
  **/
  toInt: function()
  {
    return parseInt(this);
  },

  /**
   * Aphid.Support.Extensions.String#pluralize(count[, plural]) -> String
  **/
  pluralize: function(count, plural)
  {
    if (Object.isUndefined(plural))
      plural = this + 's';
    return (count == 1 ? this + '' : plural);
  }

};

Object.extend(String.prototype, Aphid.Support.Extensions.String);
/**
 * class Aphid.Support.Cookie
 *
 * A utility class for simplifying the management of browser cookies. This
 * class is also aliased as the `$C` global (i.e. `$C.get('someCookie')`).
 *
 * **Setting a Session Cookie**
 *
 * Cookies set without an expiration date are session cookies and will be
 * expired when the user closes their browser.
 *
 *     Aphid.Support.Cookie.set("someCookie", "someValue");
 *     // => "someCookie=someValue"
 *
 * **Setting a Cookie w/Expiration**
 *
 * An expiration date may be specified, in number of days, as the third
 * parameter to the `set` method. You may also use a float as the expiration
 * to denote partial days (i.e. 2.5).
 *
 *     Aphid.Support.Cookie.set("someCookie", "someValue", 2.5);
 *     // => "someCookie=someValue; expires=Sat, 03 Jul 2010 05:41:45 GMT"
 *
 * **Reterieving Cookies**
 *
 * You may retrieve the cookie value by name. If the cookie is not set, null
 * will be returned.
 *
 *     Aphid.Support.Cookie.get("someCookie");
 *     // => "someValue"
 *
**/

// TODO Add support for setting and retrieving JSON cookies...

Aphid.Support.Cookie = {

  /**
   * Aphid.Support.Cookie.set(name, value[, daysToExpire]) -> String
   *
   * - name (String): the name of the cookie
   * - value (String): the value to be set in the cookie
   * - daysToExpire (Integer): the optional number of days before the cookie
   *   should expire
   *
   * Sets a browser cookie with the provided *name* and *value*. If
   * *daysToExpire* has not been provided, the cookie will be valid for the
   * current browser session only.
   *
   * This method returns the cookie string as it was sent to the browser.
  **/
  set: function(name, value, daysToExpire)
  {
    var expire = '';
    if (!Object.isUndefined(daysToExpire))
    {
      var date = new Date()
      date.setTime(date.getTime() + (86400000 * parseFloat(daysToExpire)));
      expire = '; expires=' + date.toGMTString();
    }
    return (document.cookie = escape(name) + '=' + (value || '') + expire);
  },

  /**
   * Aphid.Support.Cookie.get(name) -> String | false
   *
   * - name (String): the name of the cookie
   *
   * Attempts to return the cookie value by looking it up by name. If a cookie
   * could not be located, _false_ will be returned so that you may simply
   * check the existence of a cookie with `if (Aphid.Support.Cookie.get('cookieName')) { ... }`.
  **/
  get: function(name)
  {
    var cookie = document.cookie.match(new RegExp('(^|;)\\s*' + escape(name) + '=([^;\\s]*)'));
    return (cookie ? cookie[2] : false);
  },

  /**
   * Aphid.Support.Cookie.erase(name) -> String | false
   *
   * - name (String): the name of the cookie
   *
   * Erases a previously set cookie and returns the value of the cookie that
   * was erased. If a cookie could not be located, _false_ will be returned.
  **/
  erase: function(name)
  {
    var cookie = Aphid.Support.Cookie.get(name) || false;
    Aphid.Support.Cookie.set(name, '', -1);
    return cookie;
  },

  /**
   * Aphid.Support.Cookie.acceptsCookies(name) -> Boolean
   *
   * Tests the browser for cookie support.
  **/
  acceptsCookies: function()
  {
    if (typeof navigator.cookieEnabled == 'boolean')
      return navigator.cookieEnabled;
    Cookie.set('_test', '1');
    return Cookie.erase('_test') != false;
  }


}

$C = Aphid.Support.Cookie;
/**
 * class Aphid.Support.Logger
 *
 * Logging utility class for Aphid with support for multiple levels of
 * verbosity.
 *
 * **Usage Example**
 *
 *     var logger = new Aphid.Support.Logger(Aphid.Support.Logger.DEBUG_LEVEL);
 *     logger.info("Loading assets from server", "AssetLoader");
 *     // => "[AssetLoader] Loading assets from server" to the console
 *
**/
Aphid.Support.Logger = Class.create();

/**
 * Aphid.Support.Logger.DEBUG_LEVEL = 4;
 *
 * Displays all messages, including those that are simply for debugging
 * purposes.
**/
Aphid.Support.Logger.DEBUG_LEVEL = 4;

/**
 * Aphid.Support.Logger.INFO_LEVEL = 3;
 *
 * Displays messages of informational significance, as well as all warning
 * and error messages.
**/
Aphid.Support.Logger.INFO_LEVEL = 3;

/**
 * Aphid.Support.Logger.WARNING_LEVEL = 2;
 *
 * Displays warning messages that may or may not need attention, as well all
 * error messages.
**/
Aphid.Support.Logger.WARNING_LEVEL = 2;

/**
 * Aphid.Support.Logger.ERROR_LEVEL = 1;
 *
 * Displays only critical error messages that need attention.
**/
Aphid.Support.Logger.ERROR_LEVEL = 1;

Aphid.Support.Logger.prototype = {

  /**
   * Aphid.Support.Logger#level -> Number
   *
   * A number from 0 to 3 that represents the level of verbosity that should
   * be evaluated when the various instance methods are called. See constants
   * on [[Aphid.Support.Logger]] for available levels.
  **/
  level: false,

  /**
   * new Aphid.Support.Logger([level])
   *
   * Initializes a new Logger instance with an optional log *level*.
  **/
  initialize: function(level)
  {
    this.level = Object.isUndefined(level) ? Aphid.Logger.INFO_LEVEL : level;
  },

  /**
   * Aphid.Support.Logger#debug(message[, prefix]) -> null
   *
   * - message (String): the message to be displayed in the console
   * - prefix (String): an optional prefix to be displayed before the message
   *   that will be wrapped in square brackets (i.e. "\[*prefix*] *message*").
   *
   * Prints the *message* to the console at the *debug* level (if
   * [[Aphid.Support.Logger#level]] instance variable is set to at least
   * `DEBUG_LEVEL`).
  **/
  debug: function(message, prefix)
  {
    if (!window.console) return;
    if (this.level < Aphid.Support.Logger.DEBUG_LEVEL) return;
    if (prefix)
      window.console.debug('[' + prefix + '] ' + message);
    else
      window.console.debug(message);
  },

  /**
   * Aphid.Support.Logger#info(message[, prefix]) -> null
   *
   * - message (String): the message to be displayed in the console
   * - prefix (String): an optional prefix to be displayed before the message
   *   that will be wrapped in square brackets (i.e. "\[*prefix*] *message*").
   *
   * Prints the *message* to the console at the *info* level (if
   * [[Aphid.Support.Logger#level]] instance variable is set to at least
   * `INFO_LEVEL`).
  **/
  info: function(message, prefix)
  {
    if (!window.console) return;
    if (this.level < Aphid.Support.Logger.INFO_LEVEL) return;
    if (prefix)
      window.console.info('[' + prefix + '] ' + message);
    else
      window.console.info(message);
  },

  /**
   * Aphid.Support.Logger#warn(message[, prefix]) -> null
   *
   * - message (String): the message to be displayed in the console
   * - prefix (String): an optional prefix to be displayed before the message
   *   that will be wrapped in square brackets (i.e. "\[*prefix*] *message*").
   *
   * Prints the *message* to the console at the *warn* level (if
   * [[Aphid.Support.Logger#level]] instance variable is set to at least
   * `WARNING_LEVEL`).
  **/
  warn: function(message, prefix)
  {
    if (!window.console) return;
    if (this.level < Aphid.Support.Logger.WARNING_LEVEL) return;
    if (prefix)
      window.console.warn('[' + prefix + '] ' + message);
    else
      window.console.warn(message);
  },

  /**
   * Aphid.Support.Logger#error(message[, prefix]) -> null
   *
   * - message (String): the message to be displayed in the console
   * - prefix (String): an optional prefix to be displayed before the message
   *   that will be wrapped in square brackets (i.e. "\[*prefix*] *message*").
   *
   * Prints the *message* to the console at the *error* level (if
   * [[Aphid.Support.Logger#level]] instance variable is set to at least
   * `ERROR_LEVEL`).
  **/
  error: function(message, prefix)
  {
    if (!window.console) return;
    if (this.level < Aphid.Support.Logger.ERROR_LEVEL) return;
    if (prefix)
      window.console.error('[' + prefix + '] ' + message);
    else
      window.console.error(message);
  }

};
/**
 * Aphid.Core
 *
 * Contains the core scaffolding code that all Aphid-based applications
 * require, which includes the Modal-View-Controller stack support code.
**/

Aphid.Core = {};

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

  // Loading Indicator
  loadingIndicator: false,

  /**
   * new Aphid.Core.Application()
   *
   * Initializes the Logger.
  **/
  initialize: function()
  {
    this._initializeLogger();
    this._initializeLoadingIndicator();
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
    $L = this.logger;
    return this.logger;
  }

};
/**
 * Aphid.UI
 *
 * Contains the base UI components (controls, views, etc) that comprise
 * typical Aphid-based applications.
**/

Aphid.UI = {};

//
// Window Object
//
// The Aphid.UI.Window class is essentially a wrapper for managing the current
// application/document <body>.
//

Aphid.UI.Window = Class.create(
  {

    container: false,
    subviews: false,

    initialize: function()
    {
      $L.info('Initializing...', 'Aphid.UI.Window');
      this.container = $(document.body);
      this.subviews = $A();
    },

    addSubview: function(subview)
    {
      if (Object.isUndefined(subview) || Object.isUndefined(subview.element))
      {
        $L.error("A valid subclass of View was not provided. You must pass an Object to addSubview that returns the DOM structure of the view as the 'element' property of the object.", 'Aphid.UI.Window');
        return;
      }

      $L.info('Adding subview to window…', 'Aphid.UI.Window');
      this.subviews.push(subview);
      this.container.insert(subview.element);
    }

  }
);
/**
 * class Aphid.UI.View
 *
 * This class serves as a lightweight wrapper for a DOM element and as a
 * scaffold on which to build functionality on top of the wrapped HTML.
 *
 * ### Implementing Custom Views
 *
 * In general, [[Aphid.UI.View]] should be subclassed and not initialized
 * directly so that you may implement the functionality that is specific to
 * your custom view's requirements. To implement a custom view, simply create
 * a subclass of [[Aphid.UI.View]]:
 *
 *     var FooBarView = Class.create(Aphid.UI.View, {
 *       viewName: "FooBarView",
 *       fooLabel: false,
 *       contentView: false,
 *       viewDidFinishLoading: function()
 *       {
 *         this.fooLabel.element.update('Bar!');
 *       }
 *     });
 *
 * In this example, the `viewName` property specifies the name of the view
 * itself. This will be used to load the template (see the *View Templates*
 * section below for more details). The `fooLabel` and `contentView`
 * properties are outlets that will be wired up to elements within the view
 * template. Finally, the `viewDidFinishLoading` callback is called once the
 * view has loaded and in this example we are setting new content on our
 * `fooLabel` outlet.
 *
 * ### View Templates
 *
 * View templates are loaded asynchronously when the instance is first
 * initialized. The view template itself should be located in the path
 * that is defined by the `baseViewPath` instance property on your Application
 * delegate (which defaults to the relative path of *Views*). The filename of
 * the template should match the value of the [[Aphid.UI.View#viewName]]
 * property (i.e. *Views/FooBarView.html*).
 *
 *     <header>
 *       <h1 data-outlet="fooLabel">Foo</h1>
 *     </header>
 *     <section data-outlet="contentView">
 *       ...
 *     </section>
 *
 * View templates that are not wrapped in a single containing element will
 * automatically be wrapped in a <section/> element with the DOM ID set to
 * the `viewName` instance property.
 *
 * #### Outlets
 *
 * In traditional JavaScript integrations, you must peruse the DOM to select
 * the elements on which you wish to operate. In Aphid, we go one step further
 * and introduce the concept of outlets.
 *
 * An outlet is a reference to an element within a view template that is
 * automatically connected to your view instance once the view template has
 * been loaded. Outlets may be created by adding a custom attribute to the
 * element you wish to connect to named `data-outlet`. For example:
 *
 *     <header>
 *       <h1 data-outlet="viewHeader">...</h1>
 *     </header>
 *
 * You must also define an instance property in your custom view subclass
 * with the same name as the `data-outlet` attribute's value.
 *
 * When the view template loads, it will be scanned for all elements that
 * contain the data-outlet attribute and those elements will be wrapped by
 * a vanilla [[Aphid.UI.View]] instance and assigned to your view's matching
 * instance property.
 *
 * #### Actions
 *
 * Similar to outlets, actions allow you to easily map element events to
 * methods in your view subclass. For example, if you defined a `doSomething`
 * method in your subclass, you could connect a button to it with the
 * following:
 *
 *     <input type="button" data-action="doSomething" />
 *
 * This will call the `doSomething()` method on your subclass with the
 * triggered event as the first parameter. Your method signature should look
 * similar to the following:
 *
 *     doSomething: function(event)
 *     {
 *       alert('Doing it!');
 *     }
 *
 * **NOTE:** Actions are still under development and have a few shortcomings
 * that will need to be addressed, such as how to handle different event types
 * and custom parameter passing. For advanced usage and for the time being, it
 * is recommended that you set an outlet on the element and set up your own
 * event observers.
 *
 *
 * ### Delegates Methods
 *
 *  - `viewDidFinishLoading` — Called once the view template has been fully
 *    loaded and initialized. This should only ever be called once for a
 *    given view instance upon its first initialization.
 *
**/

Aphid.UI.View = Class.create(
{

  /**
   * Aphid.UI.View#delegate -> Object
   *
   * An object that will receive calls for delegate methods of this class.
  **/
  delegate: false,

  /**
   * Aphid.UI.View#viewName -> String
   *
   * The name of the view that the instance of this view will be referenced
   * by and load asynchronously. The name of the view template that will be
   * automatically (and asynchronously) loaded is derived from this name.
   *
   * For example, if your *viewName* is set to MainView, Aphid will attempt
   * to load *Views/MainView.html*. The directory in which views are loaded
   * from is managed by the Application delegate's baseViewPath property.
  **/
  viewName: false,

  /**
   * Aphid.UI.View#element -> Element
   *
   * A reference to the DOM Element that belongs to the view's instance.
  **/
  element: false,

  /**
   * Aphid.UI.View#subviews -> Array
   *
   * An array of all View instances that have been added to this view as a
   * subview.
  **/
  subviews: false,

  /**
   * Aphid.UI.View#superview -> Aphid.UI.View | false
   *
   * The superview that the View instances is currently a subview of. This may
   * change at any time and may be false if the view does not have a superview.
  **/
  superview: false,

  /**
   * Aphid.UI.View#isLoaded -> Boolean
   *
   * If the View has been loaded, this property will be set to true.
  **/
  isLoaded: false,

  /**
   * Aphid.UI.View#isLoading -> Boolean
   *
   * If the View is currently in the process of being loaded from the server,
   * this property will be set to true.
  **/
  isLoading: false,

  // Initializers ------------------------------------------------------------

  /**
   * new Aphid.UI.View()
   *
   * Initializes a new View instance.
  **/
  // TODO This is in flux...
  initialize: function(viewName, delegate)
  {
    this.subviews = $A();
    this.delegate = delegate;
    if (viewName) this.viewName = viewName;
    if (this.viewName)
    {
      this._loadViewFromTemplate();
    }
  },

  // TODO This is in flux...
  initializeFromTemplate: function(element)
  {
    this.element = element;
  },

  // View Management ---------------------------------------------------------

  /**
   * Aphid.UI.View#setView(view) -> null
   *
   * - view (View): the view that should be set
   *
   * Clears all subviews of the current view and sets the specified *view* as
   * the current view's only subview.
  **/
  setView: function(view)
  {
    this._setView(view, false);
  },

  /**
   * Aphid.UI.View#setViewAnimated(view[, animated = true]) -> null
   *
   * - view (View): the view that should be set
   * - animated (Boolean): true if the view should be presented with animation
   *
   * Clears all subviews of the current view and presents the specified *view*
   * with an animated effect (currently this effect is *appear*).
  **/
  setViewAnimated: function(view, animated)
  {
    if (Object.isUndefined(animated)) animated = true;
    this._setView(view, animated);
  },

  /*
   * Aphid.UI.View#_setView(view[, animated = false]) -> null
   *
   * - view (View): the view that should be set
   * - animated (Boolean): true if the view should be presented with animation
   *
   * Clears all subviews of the current view and presents the specified *view*
   * with an animated effect (currently this effect is *appear*).
  **/
  _setView: function(view, animated)
  {
    if (Object.isUndefined(animated)) animated = false;

    // Remove existing views
    // TODO Add viewWillDisappear/viewDidDisappear callbacks
    this.subviews.invoke('removeFromSuperview', animated);

    // Clear the Subviews
    this.subviews = $A();

    // Add the specified view as the view's only subview
    this.addSubviewAnimated(view, animated);
  },

  /**
   * Aphid.UI.View#addSubview(view) -> null
   *
   * - view (View): the view that should be set
   *
   * Adds the specified *view* as a subview of the view instance.
  **/
  addSubview: function(view)
  {
    // If the view is loading, we need to wait for it to finish loading before
    // we can add it to the DOM.
    if (view.isLoading)
      this._addSubview.bind(this).delay(0.1, view, false);

    // Otherwise, we can add it immediately.
    else
      this._addSubview(view, false);
  },

  /**
   * Aphid.UI.View#addSubviewAnimated(view[, animated = true]) -> null
   *
   * - view (View): the view that should be set
   * - animated (Boolean): true if the view should be presented with animation
   *
   * Adds the specified *view* as a subview of the view instance and presents
   * it with an animated effect, by default.
  **/
  addSubviewAnimated: function(view, animated)
  {
    if (Object.isUndefined(animated)) animated = false;

    // If the view is loading, we need to wait for it to finish loading before
    // we can add it to the DOM.
    if (view.isLoading)
      this._addSubview.bind(this).delay(0.1, view, animated);

    // Otherwise, we can add it immediately.
    else
      this._addSubview(view, animated);
  },

  /*
   * Aphid.UI.View#_addSubview(view[, animated = false]) -> null
   *
   * - view (View): the view that should be set
   * - animated (Boolean): true if the view should be presented with animation
   *
   * Adds the specified *view* as a subview of the view instance and optionally
   * presents it with an animated effect.
  **/
  _addSubview: function(view, animated)
  {
    if (Object.isUndefined(animated)) animated = false;

    // If the view has still not been loaded, delay this call again...
    if (!view.isLoaded)
    {
      // TODO We need to add a counter to this so that we don't wait longer
      // a few seconds before giving up and raising a warning...
      this._addSubview.bind(this).delay(0.1, view, animated);
      return;
    }

    $L.info('Adding "' + view.viewName + '" as a subview to "' + (this.viewName || "unknown") + '" (animated: ' + animated + ')', 'Aphid.UI.View');

    // Setup the View
    view.element.hide();
    view.superview = this;
    this.subviews.push(view);

    // "View Will Appear..."
    if (view.viewWillAppear)
      view.viewWillAppear();

    // Insert the view into the DOM
    this.element.insert(view.element);

    // Display the View
    animated ? view.element.appear({ duration: 0.25 }) : view.element.show();

    // "View Did Appear..."
    if (view.viewDidAppear)
      view.viewDidAppear();
  },

  /**
   * Aphid.UI.View#removeFromSuperview() -> null
   *
   * Removes the view from its superview, if it belongs to another view.
  **/
  removeFromSuperview: function()
  {
    this._removeFromSuperview(false);
  },

  /**
   * Aphid.UI.View#removeFromSuperviewAnimated([animated = true]) -> null
   *
   * - animated (Boolean): true if the view should be dismissed with animation
   *
   * Removes the view from its superview, with an optional animated effect.
   * This method will return immediately if the view does not belong to a
   * superview.
  **/
  removeFromSuperviewAnimated: function(animated)
  {
    if (Object.isUndefined(animated)) animated = true;
    this._removeFromSuperview(animated);
  },

  /*
   * Aphid.UI.View#_removeFromSuperview([animated = false]) -> null
   *
   * - animated (Boolean): true if the view should be dismissed with animation
   *
   * Removes the view from its superview, with an optional animated effect.
   * This method will return immediately if the view does not belong to a
   * superview.
  **/
  _removeFromSuperview: function(animated)
  {
    if (Object.isUndefined(animated)) animated = false;
    if (!this.superview)
      return;

    // "View Will Disappear"
    if (this.viewWillDisappear)
      this.viewWillDisappear();

    // Hide the View
    animated ? this.element.fade({ duration: 0.25 }) : this.element.hide();

    // Remove the View's element from the DOM
    if (this.element.parentNode != null)
      this.element = this.element.remove()

    // Remove from superview's subviews
    this.superview.subviews = this.superview.subviews.without(this);

    // Remove reference to superview
    this.superview = false;

    // "View Did Disappear"
    // TODO if animated, this needs to be called when the animation has completed instead...
    if (this.viewDidDisappear)
      this.viewDidDisappear();
  },

  // View Loading ------------------------------------------------------------

  /*
   * Aphid.UI.View#_loadViewFromTemplate() -> null
   *
   * Loads the View template (as derived from the *viewName* and
   * *Application.baseViewPath* properties) asynchronously.
  **/
  _loadViewFromTemplate: function()
  {
    var viewPath = Application.sharedInstance.baseViewPath + '/' + this.viewName + '.html',
        options  = {
          asynchronous: true,
          method: 'get',
          onComplete: this._viewDidFinishLoading.bind(this),
          onFailure: function(transport)
          {
            if (transport.status == 404)
            {
              $L.error("Missing Template HTML (" + this.viewName + ")", "Aphid.UI.View");
            }
          }.bind(this)
        };

    this.isLoaded  = false;
    this.isLoading = true;

    new Ajax.Request(viewPath, options);
  },

  /*
   * Aphid.UI.View#_viewDidFinishLoading(transport) -> null
   *
   * Callback method that is called once the view has finished loading
   * asynchronously. This method sets up the View instance by wiring any
   * outlets and actions found in the template and then calls the appropriate
   * delegate methods.
  **/
  _viewDidFinishLoading: function(transport)
  {
    // TODO This method should probably just be viewDidFinishLoading so that
    //      subclasses can call it instead of making it a delegate call
    var template = Element.fromString(transport.responseText);
    if (Object.isElement(template))
      this.element = template;
    else
      this.element = new Element("section", { className: 'view', id: this.viewName.lowerCaseFirst() }).update(transport.responseText);
    this._connectToOutlets();
    this._wireActionsToInstance();
    this.isLoaded  = true;
    this.isLoading = false;
    this.viewDidLoad();
    if (this.delegate && this.delegate.viewDidFinishLoading)
      this.delegate.viewDidFinishLoading(this);
  },

  // View Outlets ------------------------------------------------------------

  /*
   * Aphid.UI.View#_connectToOutlets() -> null
   *
   * Scans the view template for elements that have the *data-outlet*
   * attribute defined and attempts to wire them up to the View instance by
   * the specified name.
   *
   * For example, if you have a property named `someView` defined on your View
   * class and the following in your view template:
   *
   *     <section data-outlet="someView">...</section>
   *
   * ... your view instance will automatically have the `someView` property
   * reference a View instance that wraps the DOM element.
   *
   * * TODO This is still a little early in its implementation and needs to be
   *      thought out better on how to handle different event types or
   *      different element types.
  **/
  _connectToOutlets: function()
  {
    var outletElements = this.element.select('*[data-outlet]');
    $L.debug('Found ' + outletElements.length + ' ' + "outlet".pluralize(outletElements.length) + ' in the view (' + this.viewName + ')...', 'Aphid.UI.View');

    outletElements.each(
      function(element)
      {
        var outlet    = element.getAttribute('data-outlet'),
            viewClass = element.getAttribute('data-view-class');

        // If a custom view class was not provided, default to Aphid.UI.View
        if (!viewClass)
          viewClass = "Aphid.UI.View";

        if (!Object.isUndefined(this[outlet]))
        {
          var instance;
          $L.info('Connecting outlet "' + outlet + '" to view (class: ' + viewClass + ')...', 'Aphid.UI.View');
          try {
            instance = eval("new " + viewClass + "()");
            instance.delegate = this;
            instance.initializeFromTemplate(element);
            if (instance.awakeFromHTML) instance.awakeFromHTML();
          }
          catch (error)
          {
            $L.error("Unable to connect outlet (" + outlet + ") to view class (" + viewClass + ")... " + error);
            return;
          }
          this[outlet] = instance;
          this.subviews.push(instance);
        }
        else
          $L.warn('Unable to connect outlet "' + outlet + '" to view controller as the controller does not define a matching member variable', 'Aphid.UI.View');
      }.bind(this)
    );
  },

  // View Actions ------------------------------------------------------------

  /*
   * Aphid.UI.View#_wireActionsToInstance() -> null
   *
   * Scans the view template for elements that have the *data-action*
   * attribute defined and sets up Event observers to call the specified
   * method on the View instance when the Element triggers the appropriate
   * event.
   *
   * For example, if you have a method named `doSomething` defined on your View
   * class and the following in your view template:
   *
   *     <input type="button" data-action="doSomething" />
   *
   * ... the element will automatically be set up to call doSomething() on
   * your view instance when the user clicks the button.
   *
   * TODO This is still a little early in its implementation and needs to be
   *      thought out better on how to handle different event types or
   *      different element types.
  **/
  _wireActionsToInstance: function()
  {
    var actionElements = this.element.select('*[data-action]');
    $L.debug('Found ' + actionElements.length + ' ' + "action".pluralize(actionElements.length) + ' in the view (' + this.viewName + ')...', 'Aphid.UI.View');

    actionElements.each(
      function(element)
      {
        var action = element.getAttribute('data-action');
        if (!Object.isUndefined(this[action]))
        {
          element.observe('click',
            function(event)
            {
              // TODO See if this can be made into this[action]()
              eval('this.' + action + '()');
            }.bind(this)
          );

          // var instance = eval("new " + viewClass + "()");
          // instance.initializeFromTemplate(element);
          // this[outlet] = instance;
        }
        else
          $L.warn('Unable to connect action "' + action + '" to view controller as the controller does not define the requested method', 'Aphid.UI.View');
      }.bind(this)
    );
  },

  // Callbacks ---------------------------------------------------------------

  viewDidLoad: function()
  {

  }

});

// Method Name Mappings for Debugging ----------------------------------------

Aphid.UI.View.prototype.setView.displayName = "Aphid.UI.View.setView";
Aphid.UI.View.prototype.setViewAnimated.displayName = "Aphid.UI.View.setViewAnimated";
Aphid.UI.View.prototype._setView.displayName = "Aphid.UI.View._setView";
Aphid.UI.View.prototype.addSubview.displayName = "Aphid.UI.View.addSubview";
Aphid.UI.View.prototype.addSubviewAnimated.displayName = "Aphid.UI.View.addSubviewAnimated";
Aphid.UI.View.prototype._addSubview.displayName = "Aphid.UI.View._addSubview";
Aphid.UI.View.prototype.removeFromSuperview.displayName = "Aphid.UI.View.removeFromSuperview";
Aphid.UI.View.prototype.removeFromSuperviewAnimated.displayName = "Aphid.UI.View.removeFromSuperviewAnimated";
Aphid.UI.View.prototype._removeFromSuperview.displayName = "Aphid.UI.View._removeFromSuperview";
Aphid.UI.View.prototype._viewDidFinishLoading.displayName = "Aphid.UI.View._viewDidFinishLoading";
Aphid.UI.View.prototype._loadViewFromTemplate.displayName = "Aphid.UI.View._loadViewFromTemplate";
Aphid.UI.View.prototype._connectToOutlets.displayName = "Aphid.UI.View._connectToOutlets";
Aphid.UI.View.prototype._wireActionsToInstance.displayName = "Aphid.UI.View._wireActionsToInstance";

// Controllers ---------------------------------------------------------------

/**
 * class Aphid.UI.ViewController
 *
 * You should use view controllers for major views that are responsible for
 * many subviews (including view controller subviews). Situations where a
 * view controller may be desirable over a view would be the main interfaces
 * of a web application.
 *
 * View controllers are typically long-lived and include additional callbacks
 * and delegates that notify the class of view state changes, such as
 * notifying that the view will be displayed or hidden, etc.
 *
 * ### Delegates Methods
 *
 *  -
 *
**/
Aphid.UI.ViewController = Class.create(Aphid.UI.View,
{

  // isModal: false,

  // -------------------------------------------------------------------------

  initialize: function($super, delegate)
  {
    $super(this.viewName, delegate);
  },

  // Modal View Controllers --------------------------------------------------

  // presentModalViewController: function(viewController)
  // {
  //   viewController.show();
  // },

  // dismissModalViewController: function()
  // {
  //
  // }

});
/**
 * class Aphid.UI.TabViewController
 *
 * Tab View Controller
 *
 * **Initializing From HTML**
 *
 *     // In your View Template:
 *     <ul class="tabs">
 *       <li class="tab" data-tab="tab-1" data-view="firstTabView">Tab 1</li>
 *       <li class="tab" data-tab="tab-2" data-view="secondTabView">Tab 2</li>
 *     </ul>
 *
 *     <section data-outlet="firstTabView">
 *       First Tab!
 *     </section>
 *
 *     <section data-outlet="secondTabView">
 *       Second Tab!
 *     </section>
 *
**/

Aphid.UI.TabViewController = Class.create(Aphid.UI.ViewController, {

  viewName: false,
  persistSelectedTab: false,
  defaultTab: false,

  // Tabs
  tabs: false,

  // Views
  contentView: false,

  // State
  currentTab: false,

  // -------------------------------------------------------------------------

  initialize: function($super, delegate)
  {
    $super(delegate);
  },

  // View Callbacks

  viewDidLoad: function($super)
  {
    $super();

    var tabElements = this.element.select('li');
    this.tabs = tabElements
    this._setupObservers();

    // Select Persisted Tab...
    if (this.persistSelectedTab)
    {
      var selectedTab = $C.get(this.viewName + '.selectedTab');
      if (selectedTab)
      {
        $L.info('Restoring previously selected tab "' + selectedTab + '"');
        this.selectTab(selectedTab);
        return;
      }
    }

    // ... or Default Tab
    $L.info('Selecting default tab "' + this.defaultTab + '"');
    this.selectDefaultTab();
  },

  // -------------------------------------------------------------------------

  selectTab: function(tab)
  {
    // Allow selectTab to be called with an Event or an Element
    if (!Object.isElement(tab))
    {
      if (Object.isEvent(tab))
        tab = tab.element();
      else if (Object.isString(tab))
      {
        var tabName = tab;
        tab = this._findTab(tabName);
        if (Object.isUndefined(tab))
        {
          $L.warn('Tried to select a tab (' + tabName + ') that could not be found in the template');
          return;
        }
      }
    }

    // Check with shouldSelectTab to be sure that we are in a state that will
    // allow for its selection...
    if (!this._shouldSelectTab(tab))
      return;

    // Select the Tab
    this.tabs.invoke('removeClassName', 'current');
    tab.addClassName('current');

    // Set Current Tab State
    this.currentTab = tab;

    // Persist Tab Selection
    if (this.persistSelectedTab)
    {
      var tabName = tab.getAttribute('data-tab');
      $C.set(this.viewName + '.selectedTab', tabName);
    }

    if (this.didSelectTab)
      this.didSelectTab(tab);
  },

  selectDefaultTab: function()
  {
    if (this.defaultTab)
      this.selectTab(this.defaultTab);
    else
      this.selectTab(this.tabs.first());
  },

  _findTab: function(tabName)
  {
    return this.tabs.find(
      function(tab)
      {
        if (tab.getAttribute('data-tab') == tabName)
          return true;
      }
    )
  },

  // -------------------------------------------------------------------------

  _setupObservers: function()
  {
    var observeTab = function(tab)
    {
      tab.observe('click', this.selectTab.bind(this));
    }
    this.tabs.each(observeTab.bind(this));
  },

  // -------------------------------------------------------------------------

  // TODO This should simply be didSelectTab and subclasses should call $super()
  _didSelectTab: function(event)
  {
    var tab     = event.element();
    var tabName = tab.getAttribute('data-tab');

    if (!this._shouldSelectTab(tab)) return;

    this.currentTab = tab;

    this.tabs.invoke('removeClassName', 'current');
    tab.addClassName('current');


    if (this.didSelectTab)
      this.didSelectTab(tab);
  },

  // didSelectTab: function(tab)
  // {
  //   $L.info('Selected tab: ' + tab)
  // },

  // TODO This should simply be shouldSelectTab and subclasses should call $super()
  _shouldSelectTab: function(tab)
  {
    var shouldSelect = true;
    if (tab == this.currentTab) shouldSelect = false;
    if (this.shouldSelectTab) shouldSelect = this.shouldSelectTab(tab);
    return shouldSelect;
  },

  // shouldSelectTab: function(tab)
  // {
  //   $L.info('Should select tab? ' + tab)
  // }

});

// TODO Encapsulate the individual tab logic into its own model
// Aphid.UI.TabViewController.Tab = Class.create({
//
// });

// Views ---------------------------------------------------------------------

/**
 * class Aphid.UI.LoadingIndicator
 *
 * Manages the display of a canvas-based spinning loading indicator.
**/

// TODO Make this a subclass of Aphid.UI.View...

Aphid.UI.LoadingIndicator = Class.create({

  /*
   * Aphid.UI.LoadingIndicator#_canvas -> Element
   *
   * The canvas element where the loading indicator is drawn.
  **/
  _canvas: false,

  /*
   * Aphid.UI.LoadingIndicator#_canvas -> Element
   *
   * The canvas context for the loading indicator.
  **/
  _context: false,

  /**
   * Aphid.UI.LoadingIndicator#barCount -> Integer
   *
   * The number of bars that should be drawn in the spinner. Defaults to 10.
  **/
  barCount: false,

  /**
   * Aphid.UI.LoadingIndicator#barSize -> Object
   *
   * The width and height of the bars. Defaults to `{ width: 4, height: 12 }`.
  **/
  barSize: false,

  /**
   * Aphid.UI.LoadingIndicator#barColor -> String
  **/
  barColor: false,

  /**
   * Aphid.UI.LoadingIndicator#centerPosition -> Object
   *
   * The x and y coordinates for the center point of the loading indicator
   * within the canvas. This should typically be the canvas width and height
   * divided by 2.
  **/
  centerPosition: false,

  /**
   * Aphid.UI.LoadingIndicator#innerRadius -> Integer
   *
   * The inner radius of the spinning indicator. Each bar will be drawn from
   * this point, outward.
  **/
  innerRadius: false,

  /**
   * Aphid.UI.LoadingIndicator#isAnimating -> Boolean
   *
   * Whether or not the loading indicator is currently animating.
  **/
  isAnimating: false,

  /*
   * Aphid.UI.LoadingIndicator#_currentOffset -> Integer
   *
   * Whether or not the loading indicator is currently animating.
  **/
  _currentOffset: 0,

  /**
   * new Aphid.UI.LoadingIndicator()
   *
   * Initializes a new instance of the Loading Indicator.
  **/
  initialize: function()
  {
    $L.info('Initializing...', 'Aphid.UI.LoadingIndicator');

    // Set Defaults
    this.barCount       = 10;
    this.barSize        = { width: 4, height: 12 };
    this.centerPosition = { x: 48, y: 48 };
    this.innerRadius    = 10;

    // Initialize the canvas
    // TODO Size needs to be configurable
    this._canvas = new Element("canvas",
      {
        id: "loadingIndicator",
        width: 96,
        height: 96
      }
    );

    // If ExplorerCanvas is present, initialize the canvas element with it for
    // compatibility with Internet Explorer
    if (!(typeof G_vmlCanvasManager == 'undefined'))
      G_vmlCanvasManager.initElement(this._canvas);

    this._context = this._canvas.getContext("2d")
    Element.insert(document.body, this._canvas);
    this._canvas.hide();

    var color = $(this._canvas).getStyle('color');
    if (color)
    {
      colors = color.split(',');
      red    = parseInt(colors[0].substr(4, 3));
      green  = parseInt(colors[1]);
      blue   = parseInt(colors[2]);
      this.barColor = { red: red, green: green, blue: blue };
    }
    else this.barColor = { red: 85, green: 85, blue: 85 };
  },

  /**
   * Aphid.UI.LoadingIndicator#show() -> null
   *
   * Shows the loading indicator with a fade-in transition.
  **/
  show: function()
  {
    if (this.isAnimating) return;

    $L.info('Showing the loading indicator...', 'Aphid.UI.LoadingIndicator');

    this._startAnimation();
    var opacity = $(this._canvas).getStyle('opacity');
    this._canvas.appear({ duration: 0.35, to: opacity });
  },

  /**
   * Aphid.UI.LoadingIndicator#hide() -> null
   *
   * Hides the loading indicator with a quick, fade-out transition.
  **/
  hide: function()
  {
    $L.info('Hiding the loading indicator...', 'Aphid.UI.LoadingIndicator');
    this._canvas.fade({ duration: 0.15 });
    this._stopAnimation.bind(this).delay(0.15);
  },

  /*
   * Aphid.UI.LoadingIndicator#_startAnimation() -> null
   *
   * Starts the loading indicator animation.
  **/
  _startAnimation: function()
  {
    this.isAnimating = true;
    this._animateNextFrame(0);
  },

  /*
   * Aphid.UI.LoadingIndicator#_stopAnimation() -> null
   *
   * Stops drawing the loading indicator and clears its context state.
  **/
  _stopAnimation: function()
  {
    this.isAnimating = false;
    this._clearFrame(this._context);
  },

  /*
   * Aphid.UI.LoadingIndicator#_draw(context, offset) -> null
  **/
  _draw: function(context, offset)
  {
    this._clearFrame(context);
    context.save();
    context.translate(this.centerPosition.x, this.centerPosition.y);
    for (var i = 0; i < this.barCount; i++)
    {
      var currentBar = (offset + i) % this.barCount,
          pos        = this._calculatePosition(currentBar);
      context.save();
      context.translate(pos.x, pos.y);
      context.rotate(pos.angle);
      this._drawBlock(this._context, i);
      context.restore();
    }
    context.restore();
  },

  /*
   * Aphid.UI.LoadingIndicator#_drawBlock(context, barNumber) -> null
  **/
  _drawBlock: function(context, barNumber)
  {
    context.fillStyle = this._makeRGBA(this.barColor.red, this.barColor.green, this.barColor.blue, (this.barCount + 1 - barNumber) / (this.barCount + 1));
    context.fillRect(-this.barSize.width / 2, 0, this.barSize.width, this.barSize.height);
  },

  /*
   * Aphid.UI.LoadingIndicator#_animateNextFrame() -> null
  **/
  _animateNextFrame: function()
  {
    if (!this.isAnimating) return;
    this._currentOffset = (this._currentOffset + 1) % this.barCount;
    this._draw(this._context, this._currentOffset);
    this._animateNextFrame.bind(this).delay(0.05);
  },

  /*
   * Aphid.UI.LoadingIndicator#_clearFrame() -> null
  **/
  _clearFrame: function(context)
  {
    context.clearRect(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);
  },

  /*
   * Aphid.UI.LoadingIndicator#_calculateAngle(barNumber) -> Float
  **/
  _calculateAngle: function(barNumber)
  {
    return 2 * barNumber * Math.PI / this.barCount;
  },

  /*
   * Aphid.UI.LoadingIndicator#_calculatePosition(barNumber) -> Object
  **/
  _calculatePosition: function(barNumber)
  {
    var angle = this._calculateAngle(barNumber);
    return {
      y: (this.innerRadius * Math.cos(-angle)),
      x: (this.innerRadius * Math.sin(-angle)),
      angle: angle
    };
  },

  // TODO Move this to Aphid.UI.Support
  _makeRGBA: function()
  {
    return "rgba(" + [].slice.call(arguments, 0).join(",") + ")";
  }

});
/**
 * class Aphid.UI.SplitView
 *
 * This class (which extends Draggable from Scriptaculous) handles the
 * resizing of two horizontally adjacent panes.
 *
 * Minimum and maximum widths as described in the min-width and max-width
 * properties of the left pane will be enforced.
 *
 * ### TODO
 *
 *  * Allow min-width/max-width to be enforced on the right pane
 *  * Allow this to work with vertical panes as well
 *  * Automatically detect vertical or horizontal if possible
 *  * Automatically setup the drag handle if/when possible
 *  * Fix issue where the drag handle isn't moved centered (set background of dragHandle to red to illustrate)
 *  * Implement dblclick support (both with a callback and default behavior minimizing the left pane)
 *
**/

Aphid.UI.SplitView = Class.create(Aphid.UI.View, {

  // Panes
  firstView: false,
  secondView: false,

  // Draggable Instance
  draggableInstance: false,

  constraint: false, // "horizontal, vertical"

  initialize: function($super)
  {
    $super();
  },

  initializeFromTemplate: function($super, element)
  {
    $super(element);
  },

  awakeFromHTML: function()
  {
    $L.info('Awoke from HTML', 'Aphid.UI.SplitView');
    this.element.addClassName('SplitView');

    if (this.element.childElements().length != 2)
      $L.error('Instances of Split View must have only 2 children', 'Aphid.UI.SplitView');

    this.firstView = this.element.childElements()[0];
    this.secondView = this.element.childElements()[1];

    this.draggableInstance = new Aphid.UI.SplitView.Draggable(this.firstView, this.secondView, { constraint: 'vertical' });
  },

  // Pane Callbacks ----------------------------------------------------------

});

/**
 * class Aphid.UI.SplitView.Draggable
 *
 * Draggable is a custom subclass of Draggable from script.aculo.us that adds
 * support for minimum/maximum widths and heights, as defined by the
 * min-width and min-height CSS properties.
 *
 * ### TODO
 *
 *  * Move some of the logic out of this to a delegate or callback
**/
Aphid.UI.SplitView.Draggable = Class.create(Draggable, {

  // DOM Elements
  firstPane: null,
  secondPane: null,
  dragHandle: null,

  // Callbacks
  afterResize: null,

  initialize: function($super, firstPane, secondPane)
  {
    var options = arguments[3] || { };
    if (!options.constraint)
      options.constraint = 'horizontal';

    this.firstPane = $(firstPane);
    this.secondPane = $(secondPane);

    // Set up Drag Handle
    this._insertDragHandle(options.constraint);
    $super(this.dragHandle, options);

    this._setupObservers();
    this._initializePaneDimensions();
  },

  updateDrag: function($super, event, pointer)
  {
    var minWidth, maxWidth, minHeight, maxHeight;
    var offset = this.firstPane.cumulativeOffset();

    if (this.options.constraint == 'vertical')
    {
      minHeight = parseInt(this.firstPane.getStyle('min-height'));
      maxHeight = parseInt(this.firstPane.getStyle('max-height'));

      if (event.clientY - this.dragHandleClickOffset <= minHeight + offset[1])
      {
        this.resizeVertical(minHeight + offset[1]);
        this._persistState();
        return;
      }
      else if (event.clientY - this.dragHandleClickOffset >= maxHeight + offset[1])
      {
        this.resizeVertical(maxHeight + offset[1]);
        this._persistState();
        return;
      }

      $super(event, pointer);

      var height = event.clientY - this.dragHandleClickOffset;
      this.resizeVertical(height);
      // this.resizeVertical(event.clientY - offset[1]);
    }
    else
    {
      minWidth = parseInt(this.firstPane.getStyle('min-width'));
      maxWidth = parseInt(this.firstPane.getStyle('max-width'));

      if (event.clientX - this.dragHandleClickOffset <= minWidth + offset[0])
      {
        this.resizeHorizontal(minWidth + offset[0]);
        this._persistState();
        return;
      }
      else if (event.clientX - this.dragHandleClickOffset >= maxWidth + offset[0])
      {
        this.resizeHorizontal(maxWidth + offset[0]);
        this._persistState();
        return;
      }

      $super(event, pointer);

      var width = event.clientX - this.dragHandleClickOffset;
      this.resizeHorizontal(width);
    }
  },

  resizeHorizontal: function(x)
  {
    this.firstPane.setStyle({ width: x - this.firstPane.cumulativeOffset()[0] + 'px' });
    this.secondPane.setStyle({ left: x + this.dragHandle.getWidth() + 'px' });
    this.dragHandle.setStyle({ left: x + 'px' });
  },

  resizeVertical: function(y)
  {
    this.firstPane.setStyle({ height: y - this.firstPane.cumulativeOffset()[1] + 'px' });
    this.secondPane.setStyle({ top: (y - this.firstPane.cumulativeOffset()[1]) + (this.dragHandle.getHeight() * 2) + 'px' });
    this.dragHandle.setStyle({ top: (y - this.firstPane.cumulativeOffset()[1] + this.dragHandle.getHeight()) + 'px' });
  },

  // State Management --------------------------------------------------------

  _persistState: function()
  {
    if (this.options.constraint == 'vertical')
      $C.set("ResizablePanes." + this.paneSet, this.firstPane.getHeight());
    else
      $C.set("ResizablePanes." + this.paneSet, this.firstPane.getWidth());
  },

  _restoreState: function()
  {
    var paneSize = parseInt($C.get("ResizablePanes." + this.paneSet));
    var offset   = this.firstPane.cumulativeOffset();

    if (this.options.constraint == 'vertical')
      this.resizeVertical(paneSize + offset[1]);
    else
      this.resizeHorizontal(paneSize + offset[0]);
  },

  _initializePaneDimensions: function()
  {
    if (this.options.constraint == 'vertical')
    {
      var topOffset = parseInt(this.dragHandle.getStyle('top')) + parseInt(this.dragHandle.getStyle('height'));
      this.secondPane.setStyle('top: ' + topOffset  + 'px');
    }
    else
    {
      // var leftOffset = parseInt(this.firstPane.getStyle('width')) + parseInt(this.firstPane.getStyle('left')) + parseInt(this.dragHandle.getStyle('width'))
      var leftOffset = parseInt(this.dragHandle.getStyle('left')) + parseInt(this.dragHandle.getStyle('width'));
      this.secondPane.setStyle('left: ' + leftOffset + 'px');
    }
  },

  _setupObservers: function()
  {
    this.dragHandle.observe('mouseup', this._resetDragHandleClickOffset.bind(this));
    this.dragHandle.observe('mousedown', this._determineDragHandleClickOffset.bind(this));
  },

  _determineDragHandleClickOffset: function(event)
  {
    if (this.options.constraint == 'vertical')
    {
      var offset = (this.firstPane.cumulativeOffset()[1] + this.firstPane.getHeight() + this.dragHandle.getHeight()) - event.clientY;
      this.dragHandleClickOffset = this.dragHandle.getHeight() - offset;
    }
    else
    {
      var offset = (this.firstPane.cumulativeOffset()[0] + this.firstPane.getWidth() + this.dragHandle.getWidth()) - event.clientX;
      this.dragHandleClickOffset = this.dragHandle.getWidth() - offset;
    }
  },

  _resetDragHandleClickOffset: function(event)
  {
    this.dragHandleClickOffset = null;
    this._persistState();
  },

  // Drag Handle -------------------------------------------------------------

  _insertDragHandle: function(constraint)
  {
    this.dragHandle = new Element("div").addClassName("dragHandle");
    this.dragHandle.addClassName(constraint);
    Element.insert(this.firstPane, { after: this.dragHandle });
  }

});
/**
 * class Aphid.UI.ListView
 *
 * Manages an HTML unordered list by providing support for selection of the
 * items contained within the list.
 *
 * #### Usage
 *
 * To initialize an instance of [[Aphid.UI.ListView]], you must specify the
 * `data-view-class` attribute on an HTML unordered list element. The value
 * of this attribute should be either [[Aphid.UI.ListView]], for a standard
 * list, or the name of your [[Aphid.UI.ListView]] subclass. For example:
 *
 *     <ul data-outlet="listView" data-view-class="Aphid.UI.ListView">
 *       <li>Inbox</li>
 *       <li>Sent</li>
 *     </ul>
 *
 * #### Delegate Methods
 *
 *  * `listViewShouldSelectItem(listView, item)` - Called just before the item
 *    selection process begins. Returning false will prevent the selection
 *    from happening.
 *
 *  * `listViewSelectionDidChange(listView, selectedItem)` - Called when the
 *    current selection has changed.
 *
 *  * `listViewOrderDidChange(listView)` - Called when the sort order has
 *    changed, but not necessarily before the user has finished dragging the
 *    item to its final position.
 *
 *  * `listViewOrderDidUpdate(listView)` - Called after the user
 *    has finished dragging.
 *
 * #### Subclassing Notes
 *
**/

Aphid.UI.ListView = Class.create(Aphid.UI.View, {

  viewName: false,

  /**
   * Aphid.UI.ListView#items -> Array
   *
   * An array of Elements for each list item that is part of the list.
  **/
  items: false,

  /**
   * Aphid.UI.ListView#selectedItem -> Element | false
   *
   * The currently selected list item, or false if no item is currently
   * selected.
  **/
  selectedItem: false,

  /**
   * Aphid.UI.ListView#isSortable -> Boolean
   *
   * If isSortable is set to true, the list will have Sortable applied to it
   * automatically.
  **/
  isSortable: false,

  /**
   * Aphid.UI.ListView#sortableOptions -> Object
   *
   * Options to be passed to the Sortable instance when sorting is enabled.
   * For a list of options, consule the [Sortable documentation](http://wiki.github.com/madrobby/scriptaculous/sortable-create)
   * in the script.aculo.us library. Defaults:
   *
   *     {
   *       asdf: "foo"
   *     }
  **/
  sortableOptions: false,

  /**
   * new Aphid.UI.ListView()
   *
   * Initializes a new instance.
  **/
  initialize: function($super)
  {
    $super();
    this.items = $A();
    this.sortableOptions = {
      handle: "handle",
      onChange: this._listViewOrderDidChange.bind(this),
      onUpdate: this._listViewOrderDidUpdate.bind(this)
    }
  },

  initializeFromTemplate: function($super, element)
  {
    $super(element);
    if (this._validateContainer())
    {
      this.items = this.element.childElements();
      this._setupObservers();
      if (this.isSortable)
        $L.info('sortable')
    }
  },

  awakeFromHTML: function()
  {
    $L.info('Awoke from HTML', 'Aphid.UI.ListView');
    if (this.isSortable)
      this._setupSorting();
    this.element.addClassName('ListView');
  },

  // Items -------------------------------------------------------------------

  /**
   * Aphid.UI.ListView#setItems(newItems) -> null
   *
   *  - newItems (Array): An array of list item Elements to set on the list
   *
   * Sets the items in the list view to the specified items. Previous items
   * will be removed.
  **/
  setItems: function(newItems)
  {
    this.items = this.element.update().insert(newItems).select('>li');
    this._setupObservers();
  },

  // Selection ---------------------------------------------------------------

  /**
   * Aphid.UI.ListView#selectItem(listItem) -> null
   *
   * Selects the specified list item. The list item must be an Element
   * reference to the item to be selected.
  **/
  selectItem: function(item)
  {
    // Check with the listViewShouldSelectItem delegate to be sure that we are
    // in a state that will allow for its selection...
    if (!this._listViewShouldSelectItem(item))
      return;

    $L.info('Selecting item ' + this.items.indexOf(item) + ' in list...', 'Aphid.UI.ListView');

    // Don't allow the currently selected item to be reselected.
    if (this.selectedItem && this.selectedItem == item)
      return;

    // Clear the previous selection and select the new item.
    this.clearSelection();
    this.selectedItem = item.addClassName('selected');

    // Call the listViewSelectionDidChange method on the delegate, if the
    // delegate has defined it.
    if (this.delegate && this.delegate.listViewSelectionDidChange)
      this.delegate.listViewSelectionDidChange(this, item);
  },

  /**
   * Aphid.UI.ListView#clearSelection() -> null
   *
   * Clears the currently selected item, if any, leaving the list view in an
   * unselected state.
  **/
  clearSelection: function()
  {
    this.items.invoke('removeClassName', 'selected');
    this.selectedItem = false;
  },

  // Sorting -----------------------------------------------------------------

  /*
   * Aphid.UI.ListView#_setupSorting() -> null
  **/
  _setupSorting: function()
  {
    this.element.addClassName('sortable');
    this._addDragHandlesToItems();
    this._addOrderedIdentitiesToItems();
    Sortable.create(this.element, this.sortableOptions);
  },

  // TODO This is a hack to make the onUpdate callback trigger after the list order was updated
  _addOrderedIdentitiesToItems: function()
  {
    this.items.each(this._addOrderedIdentityToItem.bind(this));
  },

  _addOrderedIdentityToItem: function(item)
  {
    $L.info(item.identify())
  },

  _addDragHandlesToItems: function()
  {
    this.items.each(this._addDragHandlesToItem.bind(this));
  },

  _addDragHandlesToItem: function(item)
  {
    var foo = new Element('div').addClassName('handle');
    item.insert(foo)
  },

  // Call the listViewSelectionDidChange method on the delegate, if the
  // delegate has defined it.
  _listViewOrderDidChange: function()
  {
    $L.info('_listViewOrderDidChange', 'Aphid.UI.ListView');
    if (this.delegate && this.delegate.listViewOrderDidChange)
      this.delegate.listViewOrderDidChange(this);
  },

  _listViewOrderDidUpdate: function()
  {
    $L.info('_listViewOrderDidUpdate', 'Aphid.UI.ListView');
    if (this.delegate && this.delegate.listViewOrderDidUpdate)
      this.delegate.listViewOrderDidUpdate(this);
  },

  // Event Handling ----------------------------------------------------------

  /*
   * Aphid.UI.ListView#_setupObservers() -> null
   *
   * Iterates across each item in the list adding event observers for handling
   * click events and wiring them up to callbacks.
  **/
  _setupObservers: function()
  {
    var anchors = this.element.select('> li > a');
    if (anchors.length > 0)
      anchors.invoke('observe', 'click', this._handleClickEvent.bind(this));
    else
      this.items.invoke('observe', 'click', this._handleClickEvent.bind(this));
  },

  _handleClickEvent: function(event)
  {
    event.stop();
    var item = event.findElement('li');
    this.selectItem(item);
  },

  // Callbacks ---------------------------------------------------------------

  _listViewShouldSelectItem: function(item)
  {
    $L.info('_listViewShouldSelectItem', 'Aphid.UI.ListView');
    var shouldSelect = true;
    if (item == this.selectedItem)
      shouldSelect = false;
    if (this.delegate && this.delegate.listViewShouldSelectItem)
      shouldSelect = this.delegate.listViewShouldSelectItem(item);
    return shouldSelect;
  },

  // -------------------------------------------------------------------------

  /*
   * Aphid.UI.ListView#_validateContainer() -> Boolean
   *
   * Evaluates the element for this instance to ensure that the element meets
   * all requirements to be used with this class.
  **/
  _validateContainer: function()
  {
    if (this.element.tagName != 'UL')
    {
      $L.error('Container (' + this.element.inspect() + ') is not an Unordered List (<ul>).', 'Aphid.UI.ListView');
      return false;
    }
    return true;
  }

});

// Method Name Mappings for Debugging ----------------------------------------

Aphid.UI.ListView.prototype.initialize.displayName = "Aphid.UI.ListView.initialize";
Aphid.UI.ListView.prototype.initializeFromTemplate.displayName = "Aphid.UI.ListView.initializeFromTemplate";
Aphid.UI.ListView.prototype.awakeFromHTML.displayName = "Aphid.UI.ListView.awakeFromHTML";
Aphid.UI.ListView.prototype.setItems.displayName = "Aphid.UI.ListView.setItems";
Aphid.UI.ListView.prototype.selectItem.displayName = "Aphid.UI.ListView.selectItem";
Aphid.UI.ListView.prototype.clearSelection.displayName = "Aphid.UI.ListView.clearSelection";
Aphid.UI.ListView.prototype._setupSorting.displayName = "Aphid.UI.ListView._setupSorting";
Aphid.UI.ListView.prototype._addOrderedIdentitiesToItems.displayName = "Aphid.UI.ListView._addOrderedIdentitiesToItems";
Aphid.UI.ListView.prototype._addOrderedIdentityToItem.displayName = "Aphid.UI.ListView._addOrderedIdentityToItem";
Aphid.UI.ListView.prototype._addDragHandlesToItems.displayName = "Aphid.UI.ListView._addDragHandlesToItems";
Aphid.UI.ListView.prototype._addDragHandlesToItem.displayName = "Aphid.UI.ListView._addDragHandlesToItem";
Aphid.UI.ListView.prototype._listViewOrderDidChange.displayName = "Aphid.UI.ListView._listViewOrderDidChange";
Aphid.UI.ListView.prototype._listViewOrderDidUpdate.displayName = "Aphid.UI.ListView._listViewOrderDidUpdate";
Aphid.UI.ListView.prototype._setupObservers.displayName = "Aphid.UI.ListView._setupObservers";
Aphid.UI.ListView.prototype._handleClickEvent.displayName = "Aphid.UI.ListView._handleClickEvent";
Aphid.UI.ListView.prototype._listViewShouldSelectItem.displayName = "Aphid.UI.ListView._listViewShouldSelectItem";
Aphid.UI.ListView.prototype._validateContainer.displayName = "Aphid.UI.ListView._validateContainer";
