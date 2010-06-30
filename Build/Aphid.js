
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

  fromString: function(string)
  {
    return new Element('div').update(string.trim()).firstChild;
  }

};

Object.extend(Element, Aphid.Support.Extensions.Vendor.Prototype.Element);

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

};

Element.addMethods(Aphid.Support.Extensions.Vendor.Prototype.Element.Methods);

Aphid.Support.Extensions.Object = {

  isEvent: function(object)
  {
    return Object.isArray(object.toString().match('Event'));
  }

}

Object.extend(Object, Aphid.Support.Extensions.Object);
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


Aphid.Support.Cookie = {

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

  get: function(name)
  {
    var cookie = document.cookie.match(new RegExp('(^|;)\\s*' + escape(name) + '=([^;\\s]*)'));
    return (cookie ? cookie[2] : false);
  },

  erase: function(name)
  {
    var cookie = Aphid.Support.Cookie.get(name) || false;
    Aphid.Support.Cookie.set(name, '', -1);
    return cookie;
  },

  acceptsCookies: function()
  {
    if (typeof navigator.cookieEnabled == 'boolean')
      return navigator.cookieEnabled;
    Cookie.set('_test', '1');
    return Cookie.erase('_test') != false;
  }


}

$C = Aphid.Support.Cookie;
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

Aphid.UI = {};


Aphid.UI.Window = Class.create(
  {

    container: false,
    subviews: false,

    initialize: function()
    {
      $L.info('Initializing window…', 'Aphid.UI.Window');
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

Aphid.UI.View = Class.create(
{

  delegate: false,

  viewName: false,
  _element: false,

  subviews: false,
  superview: false,

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

  initializeFromTemplate: function(element)
  {
    this.element = element;
  },

  setView: function(view, animated)
  {
    this.subviews.invoke('removeFromSuperview', animated);

    this.subviews = $A();

    this.addSubview(view, animated);

  },

  addSubview: function(view, animated)
  {
    $L.info('Adding subview...', 'Aphid.UI.View');

    view.element.hide();
    view.superview = this;
    this.subviews.push(view);

    if (view.viewWillAppear)
      view.viewWillAppear();

    this.element.insert(view.element);

    animated ? view.element.appear({ duration: 0.25 }) : view.element.show();

    if (view.viewDidAppear)
      view.viewDidAppear();
  },

  removeFromSuperview: function(animated)
  {
    if (this.viewWillDisappear)
      this.viewWillDisappear();

    animated ? this.element.fade({ duration: 0.25 }) : this.element.hide();

    this.element = this.element.remove()

    this.superview.subviews = this.superview.subviews.without(this);

    this.superview = false;

    if (this.viewDidDisappear)
      this.viewDidDisappear();
  },

  _loadViewFromTemplate: function()
  {
    var viewPath = Application.sharedInstance.baseViewPath + '/' + this.viewName + '.html',
        options  = {
          asynchronous: true,
          method: 'get',
          onComplete: function(transport)
          {
            var template = Element.fromString(transport.responseText);
            if (Object.isElement(template))
              this.element = template;
            else
              this.element = new Element("section", { className: 'view', id: this.viewName.lowerCaseFirst() }).update(transport.responseText);
            this._connectToOutlets();
            this._wireActionsToInstance();
            if (this.viewDidLoad)
              this.viewDidLoad();
            if (this.delegate)
              this.delegate.viewDidFinishLoading(this);
          }.bind(this),
          onFailure: function(transport)
          {
            if (transport.status == 404)
            {
              $L.error("Missing Template HTML (" + this.viewName + ")", "Aphid.UI.View");
            }
          }.bind(this)
        };

    new Ajax.Request(viewPath, options);
  },


  _connectToOutlets: function()
  {
    var outletElements = this.element.select('*[data-outlet]');
    $L.debug('Found ' + outletElements.length + ' outlet(s) in the view (' + this.viewName + ')...', 'Aphid.UI.View');

    outletElements.each(
      function(element)
      {
        var outlet    = element.getAttribute('data-outlet'),
            viewClass = element.getAttribute('data-viewClass');

        if (!Object.isUndefined(this[outlet]))
        {
          var instance;
          $L.info('Connecting outlet "' + outlet + '" to view controller...', 'Aphid.UI.View');
          try {
            if (viewClass)
              instance = eval("new " + viewClass + "()");
            else
              instance = new Aphid.UI.View();
            instance.initializeFromTemplate(element);
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

  _wireActionsToInstance: function()
  {
    var actionElements = this.element.select('*[data-action]');
    $L.debug('Found ' + actionElements.length + ' action(s) in the view (' + this.viewName + ')...', 'Aphid.UI.View');

    actionElements.each(
      function(element)
      {
        var action = element.getAttribute('data-action');
        if (!Object.isUndefined(this[action]))
        {
          element.observe('click',
            function(event)
            {
              eval('this.' + action + '()');
            }.bind(this)
          );

        }
        else
          $L.warn('Unable to connect action "' + action + '" to view controller as the controller does not define the requested method', 'Aphid.UI.View');
      }.bind(this)
    );
  }


});


Aphid.UI.View.prototype._loadViewFromTemplate.displayName = "Aphid.UI.View._loadViewFromTemplate";

Aphid.UI.ViewController = Class.create(Aphid.UI.View,
{

  isModal: false,


  initialize: function($super, delegate)
  {

    $super(this.viewName, delegate);


  },


  presentModalViewController: function(viewController)
  {
    viewController.show();
  }

});

Aphid.UI.TabViewController = Class.create(Aphid.UI.ViewController, {

  viewName: false,

  tabs: false,

  contentView: false,

  currentTab: false,


  initialize: function($super, delegate)
  {
    $super(delegate);
  },


  viewDidLoad: function()
  {
    var tabElements = this.element.select('li');
    this.tabs = tabElements
    this._setupObservers();
  },


  viewDidFinishLoading: function(view)
  {
  },


  _setupObservers: function()
  {
    var observeTab = function(tab)
    {
      tab.observe('click', this._didSelectTab.bind(this));
    }
    this.tabs.each(observeTab.bind(this));
  },


  _didSelectTab: function(event)
  {
    var tab = event.element();

    if (!this._shouldSelectTab(tab)) return;

    this.currentTab = tab;

    this.tabs.invoke('removeClassName', 'current');
    tab.addClassName('current');

    if (this.didSelectTab)
      this.didSelectTab(tab);
  },


  _shouldSelectTab: function(tab)
  {
    var shouldSelect = true;
    if (tab == this.currentTab) shouldSelect = false;
    if (this.shouldSelectTab) shouldSelect = this.shouldSelectTab(tab);
    return shouldSelect;
  },


});

var loadingIndicator;
var LoadingIndicator = Class.create();

LoadingIndicator.show = function() { loadingIndicator.show(); }
LoadingIndicator.hide = function() { loadingIndicator.hide(); }

LoadingIndicator.prototype = {

  canvas: null,
  context: null,

  bars: null,
  barSize: null,
  barColor: null,
  center: null,
  innerRadius: null,

  _animating: false,
  _currentOffset: 0,

  initialize: function()
  {

    this._log('Initializing...');

    this.canvas = new Element("canvas",
      {
        id: "loadingIndicator",
        width: 96,
        height: 96
      }
    );

    if (!(typeof G_vmlCanvasManager == 'undefined'))
      G_vmlCanvasManager.initElement(this.canvas);

    this.context = this.canvas.getContext("2d")
    Element.insert(document.body, this.canvas);
    this.canvas.hide()


    this.bars = 10
    this.barSize = { width: 4, height: 12 }

    var color = $(this.canvas).getStyle('color')
    if (color)
    {
      colors = color.split(',')
      red = parseInt(colors[0].substr(4, 3))
      green = parseInt(colors[1])
      blue = parseInt(colors[2])
      this.barColor = { red: red, green: green, blue: blue }
    }
    else this.barColor = { red: 85, green: 85, blue: 85 }
    this.center = { x: 48, y: 48}
    this.innerRadius = 10
  },

  show: function()
  {
    if (this._animating) return;

    this._log('Showing the loading indicator...');

    this._startAnimation()
    var opacity = $(this.canvas).getStyle('opacity')
    this.canvas.appear({ duration: 0.35, to: opacity })
  },

  hide: function()
  {
    this._log('Hiding the loading indicator...');

    this.canvas.fade({ duration: 0.15 })
    this._stopAnimation.bind(this).delay(0.15)
  },


  _stopAnimation: function()
  {
    this._animating = false
    this._clearFrame(this.context)
  },

  _startAnimation: function()
  {
    this._animating = true
    this._animateNextFrame(0)
  },

  _draw: function(context, offset)
  {
    this._clearFrame(context)
    context.save()
    context.translate(this.center.x, this.center.y)
    for(var i = 0; i < this.bars; i++)
    {
      var currentBar = (offset + i) % this.bars,
          pos        = this._calculatePosition(currentBar)
      context.save()
      context.translate(pos.x, pos.y)
      context.rotate(pos.angle)
      this._drawBlock(this.context, i)
      context.restore()
    }
    context.restore()
  },

  _drawBlock: function(context, barNumber)
  {
    context.fillStyle = this._makeRGBA(this.barColor.red, this.barColor.green, this.barColor.blue, (this.bars + 1 - barNumber) / (this.bars + 1));
    context.fillRect(-this.barSize.width / 2, 0, this.barSize.width, this.barSize.height);
  },

  _animateNextFrame: function()
  {
    if (!this._animating) return;
    this._currentOffset = (this._currentOffset + 1) % this.bars;
    this._draw(this.context, this._currentOffset);
    this._animateNextFrame.bind(this).delay(0.05);
  },

  _clearFrame: function(context)
  {
    context.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)
  },

  _calculateAngle: function(barNumber)
  {
    return 2 * barNumber * Math.PI / this.bars;
  },

  _calculatePosition: function(barNumber)
  {
    var angle = this._calculateAngle(barNumber);
    return {
      y: (this.innerRadius * Math.cos(-angle)),
      x: (this.innerRadius * Math.sin(-angle)),
      angle: angle
    };
  },

  _makeRGBA: function()
  {
    return "rgba(" + [].slice.call(arguments, 0).join(",") + ")"
  },


  _log: function(message, level)
  {
    if (!window.console) return;
    if (Object.isUndefined(level)) level = 'log';
    eval('window.console.' + level + '("[LoadingIndicator] ' + message + '")');
  }

}


Event.observe(document, 'dom:loaded',
  function(event)
  {

    loadingIndicator = new LoadingIndicator();

    Ajax.Responders.register(
      {
        onCreate: LoadingIndicator.show,
        onComplete: LoadingIndicator.hide
      }
    );
  }
);
