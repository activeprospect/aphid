/*
 * Aphid Framework
**/

/**
 * ==Aphid Framework==
 *
 * The Aphid namespace is the main container for the various Aphid frameworks
 * and contains other metadata for Aphid, including version.
 *
 * **Usage Instructions**
 *
 * *Work in progress.*
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
 * class Aphid.Support.Compatibility.String.Trim
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
 * Aphid.Support.Extensions.String
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
  }

};

Object.extend(String.prototype, Aphid.Support.Extensions.String);
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
/**
 * Aphid.UI
 *
 * Contains the base UI components (controls, views, etc) that comprise
 * typical Aphid-based applications.
**/

Aphid.UI = {};
