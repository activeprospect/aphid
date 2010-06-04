var Aphid = {

  Version: '1.0.0-alpha'

};


Aphid.Support = {};


Aphid.Support.Compatibility = {};


Aphid.Support.Compatibility.HTML5 = {

  Elements: [
    'abbr', 'article', 'aside', 'audio', 'canvas', 'details', 'figcaption',
    'figure', 'footer', 'header', 'hgroup', 'mark', 'meter', 'nav', 'output',
    'progress', 'section', 'summary', 'time', 'video'
  ],

  createElements: function()
  {
    this.Elements.each(this._createHTML5Element);
  },

  _createElement: function(elementName)
  {
    document.createElement(element);
  }

}
if (Prototype.Browser.IE)
  Aphid.Support.Compatibility.HTML5.createHTML5Elements();

Aphid.Support.Compatibility.String = {}

Aphid.Support.Compatibility.String.Trim = {

  trim: function()
  {
    return this.replace(/^\s+|\s+$/g,"");
  },

  trimLeft: function()
  {
    return this.replace(/^\s+/,"");
  },

  trimRight: function()
  {
    return this.replace(/\s+$/,"");
  }

}

if (Object.isUndefined("".trim))
  Object.extend(String.prototype, Aphid.Support.Compatibility.String.TrimSupport);

Aphid.Support.Extensions = {};


Aphid.Support.Extensions.Vendor = {};


Aphid.Support.Extensions.Vendor.Prototype = {};


Aphid.Support.Extensions.Vendor.Prototype.Element = {

  Element.fromString = function(string)
  {
    return new Element('div').update(string.trim()).firstChild;
  }

};

Aphid.Support.Extensions.Vendor.Prototype.Element.Methods = {

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

}
Element.addMethods(Aphid.Support.Extensions.Vendor.Prototype.Element.Methods);
Aphid.Support.Extensions.String = {

  lowerCaseFirst: function()
  {
    return this.charAt(0).toLowerCase() + this.substring(1);
  },

  toInt: function()
  {
    return parseInt(this);
  }

};

Object.extend(String.prototype, Aphid.Support.Extensions.String);
Aphid.Support.Logger = Class.create();

Aphid.Support.Logger.DEBUG_LEVEL = 4;

Aphid.Support.Logger.INFO_LEVEL = 3;

Aphid.Support.Logger.WARNING_LEVEL = 2;

Aphid.Support.Logger.ERROR_LEVEL = 1;

Aphid.Support.Logger.prototype = {

  level: false,

  initialize: function(level)
  {
    this.level = Object.isUndefined(level) ? Aphid.Logger.INFO_LEVEL : level;
  },

  debug: function(message, prefix)
  {
    if (!window.console) return;
    if (this.level < Aphid.Support.Logger.DEBUG_LEVEL) return;
    if (prefix)
      window.console.debug('[' + prefix + '] ' + message);
    else
      window.console.debug(message);
  },

  info: function(message, prefix)
  {
    if (!window.console) return;
    if (this.level < Aphid.Support.Logger.INFO_LEVEL) return;
    if (prefix)
      window.console.info('[' + prefix + '] ' + message);
    else
      window.console.info(message);
  },

  warn: function(message, prefix)
  {
    if (!window.console) return;
    if (this.level < Aphid.Support.Logger.WARNING_LEVEL) return;
    if (prefix)
      window.console.warn('[' + prefix + '] ' + message);
    else
      window.console.warn(message);
  },

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

Aphid.Core = {};

Aphid.UI = {};
Aphid.Core.Application = Class.create();

Aphid.Core.Application.prototype = {

  logLevel: Aphid.Support.Logger.DEBUG_LEVEL,
  logger: false,

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
