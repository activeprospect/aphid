
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
    Logger.info('Adding subview to view…', 'View')

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
            window.console.log(Element.fromString(transport.responseText))
            this.element = Element.fromString(transport.responseText);
            this._connectToOutlets();
            this._wireActionsToInstance();
            if (this.viewDidLoad)
              this.viewDidLoad();
            if (this.delegate)
            {
              this.delegate.viewDidFinishLoading(this);
            }
          }.bind(this),
          onFailure: function(transport)
          {
            if (transport.status == 404)
            {
              Logger.error("Missing Template HTML (" + this.viewName + ")", "View")
            }
          }.bind(this)
        };

    new Ajax.Request(viewPath, options);
  },


  _connectToOutlets: function()
  {
    Logger.debug('View._connectToOutlets')

    var outletElements = this.element.select('*[data-outlet]');
    window.console.log(outletElements)

    outletElements.each(
      function(element)
      {
        var outlet    = element.getAttribute('data-outlet'),
            viewClass = element.getAttribute('data-viewClass');

        if (!Object.isUndefined(this[outlet]))
        {
          var instance;
          Logger.info('Connected outlet "' + outlet + '" to View...');
          try {
            if (viewClass)
              instance = eval("new " + viewClass + "()");
            else
              instance = new View();
            instance.initializeFromTemplate(element);
          }
          catch (error)
          {
            Logger.error("Unable to connect outlet (" + outlet + ") to view class (" + viewClass + ")... " + error)
            return;
          }
          this[outlet] = instance;
          this.subviews.push(instance);
        }
        else
          Logger.warn('Missing connection... ' + outlet);
      }.bind(this)
    );
  },

  _wireActionsToInstance: function()
  {
    var actionElements = this.element.select('*[data-action]');
    actionElements.each(
      function(element)
      {
        var action = element.getAttribute('data-action');
        if (!Object.isUndefined(this[action]))
        {
          element.observe('click',
            function(event)
            {
              eval('this.' + action + '()')
            }.bind(this)
          )

        }
        else
          Logger.warn('Missing action... ' + action);
      }.bind(this)
    );

    window.console.log(actionElements)
  }


});


View.prototype._loadViewFromTemplate.displayName = "View._loadViewFromTemplate"

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
