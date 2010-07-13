
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
  },

  pluralize: function(count, plural)
  {
    if (Object.isUndefined(plural))
      plural = this + 's';
    return (count == 1 ? this + '' : plural);
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

  loadingIndicator: false,

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

Aphid.UI = {};


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

Aphid.UI.View = Class.create(
{

  delegate: false,

  viewName: false,

  element: false,

  subviews: false,

  superview: false,

  isLoaded: false,

  isLoading: false,

  initializedFromTemplate: false,


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
    $L.info("initializeFromTemplate", "Aphid.UI.View");
    this.initializedFromTemplate = true;
    this.element = element;
  },


  setView: function(view)
  {
    this._setView(view, false);
  },

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

    this.subviews.invoke('removeFromSuperview', animated);

    this.subviews = $A();

    this.addSubviewAnimated(view, animated);
  },

  addSubview: function(view)
  {
    if (view.isLoading)
      this._addSubview.bind(this).delay(0.1, view, false);

    else
      this._addSubview(view, false);
  },

  addSubviewAnimated: function(view, animated)
  {
    if (Object.isUndefined(animated)) animated = false;

    if (view.isLoading)
      this._addSubview.bind(this).delay(0.1, view, animated);

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

    if (!view.isLoaded)
    {
      this._addSubview.bind(this).delay(0.1, view, animated);
      return;
    }

    $L.info('Adding "' + view.viewName + '" as a subview to "' + (this.viewName || "unknown") + '" (animated: ' + animated + ')', 'Aphid.UI.View');

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

  removeFromSuperview: function()
  {
    this._removeFromSuperview(false);
  },

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

    if (this.viewWillDisappear)
      this.viewWillDisappear();

    animated ? this.element.fade({ duration: 0.25 }) : this.element.hide();

    if (this.element.parentNode != null)
      this.element = this.element.remove()

    this.superview.subviews = this.superview.subviews.without(this);

    this.superview = false;

    if (this.viewDidDisappear)
      this.viewDidDisappear();
  },


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
   *
   * TODO This method should probably just be viewDidFinishLoading so that subclasses can call it instead of making it a delegate call
   *
  **/
  _viewDidFinishLoading: function(transport)
  {
    var template = Element.fromString(transport.responseText);

    if (this.initializedFromTemplate)
    {
      this.element.update(template);
    }

    else
    {
      if (Object.isElement(template))
        this.element = template;
      else
        this.element = new Element("section", { className: 'view', id: this.viewName.lowerCaseFirst() }).update(transport.responseText);
    }

    this._connectToOutlets();
    this._wireActionsToInstance();
    this.isLoaded  = true;
    this.isLoading = false;
    this.viewDidLoad();
    if (this.delegate && this.delegate.viewDidFinishLoading)
      this.delegate.viewDidFinishLoading(this);
  },


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
              eval('this.' + action + '()');
            }.bind(this)
          );

        }
        else
          $L.warn('Unable to connect action "' + action + '" to view controller as the controller does not define the requested method', 'Aphid.UI.View');
      }.bind(this)
    );
  },


  viewDidLoad: function()
  {

  }

});


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


Aphid.UI.ViewController = Class.create(Aphid.UI.View,
{

  /*
   * Aphid.UI.ViewController#_modalViewOverlay -> Element | false
   *
   * The semi-translucent overlay element that is displayed behind modal views.
  **/
  _modalViewOverlay: false,

  /*
   * Aphid.UI.ViewController#_modalViewContainer -> Element | false
   *
   * The container element that will contain the modal view controller's view.
  **/
  _modalViewContainer: false,

  modalViewController: false,


  initialize: function($super, delegate)
  {
    $super(this.viewName, delegate);
  },


  presentModalViewController: function(viewController)
  {
    $L.info("presentModalViewController", "Aphid.UI.ViewController");
    this.presentModalViewControllerAnimated(viewController, false);
  },

  presentModalViewControllerAnimated: function(viewController, animated)
  {
    if (Object.isUndefined(animated)) animated = true;

    if (viewController.isLoading)
      this._presentModalViewController.bind(this).delay(0.1, viewController, animated);

    else
      this._presentModalViewController(viewController, animated);
  },

  /*
   * Aphid.UI.View#_presentModalViewController(viewController[, animated = false]) -> null
   *
   * - viewController (ViewController): the view controller that should be presented
   * - animated (Boolean): true if the view controller should be presented with animation
   *
   * Presents the specified *viewController* as the modal view of the current
   * view controller, presenting it optionally with an animated effect.
  **/
  _presentModalViewController: function(viewController, animated)
  {
    if (Object.isUndefined(animated)) animated = false;

    if (!viewController.isLoaded)
    {
      this._presentModalViewController.bind(this).delay(0.1, viewController, animated);
      return;
    }

    $L.info('Adding "' + viewController.viewName + '" as a subview to "' + (this.viewName || "unknown") + '" (animated: ' + animated + ')', 'Aphid.UI.ViewController');

    if (!this._modalViewOverlay)
    {
      this._modalViewOverlay = new Element("div", { className: 'modalViewOverlay' });
      this._modalViewOverlay.hide();
      Element.insert(document.body, { top: this._modalViewOverlay });
    }
    animated ? this._modalViewOverlay.appear({ duration: 0.25 }) : this._modalViewOverlay.show();

    if (!this._modalViewContainer)
    {
      this._modalViewContainer = new Element("div", { className: 'modalView' });
      this._modalViewContainer.hide();
      document.body.insert(this._modalViewContainer);
    }
    this._modalViewContainer.appear({ duration: 0.5 }).morph({ top: "10%", bottom: "10%" }, { duration: 0.25 })

    viewController.element.hide();
    viewController.superview = this;

    this.modalViewController = viewController;
    this.subviews.push(this.modalViewController);

    if (this.modalViewController.viewWillAppear)
      this.modalViewController.viewWillAppear();

    this._modalViewContainer.insert(this.modalViewController.element);

    animated ? this.modalViewController.element.appear({ duration: 0.25 }) : this.modalViewController.element.show();

    if (this.modalViewController.viewDidAppear)
      this.modalViewController.viewDidAppear();
  },

  dismissModalViewController: function()
  {
    this.dismissModalViewControllerAnimated(false);
  },

  dismissModalViewControllerAnimated: function(animated)
  {
    if (Object.isUndefined(animated)) animated = true;
    if (!this.modalViewController) return;

    animated ? this._modalViewContainer.fade({ duration: 0.25 }) : this._modalViewContainer.hide();
    animated ? this._modalViewOverlay.fade({ duration: 0.25 }) : this._modalViewOverlay.hide();
    this._modalViewContainer.update();
  }

});

Aphid.UI.TabViewController = Class.create(Aphid.UI.ViewController, {

  viewName: false,
  persistSelectedTab: false,
  defaultTab: false,

  tabs: false,

  contentView: false,

  currentTab: false,


  initialize: function($super, delegate)
  {
    $super(delegate);
  },


  viewDidLoad: function($super)
  {
    $super();

    var tabElements = this.element.select('li');
    this.tabs = tabElements
    this._setupObservers();

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

    $L.info('Selecting default tab "' + this.defaultTab + '"');
    this.selectDefaultTab();
  },


  selectTab: function(tab)
  {
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

    if (!this._shouldSelectTab(tab))
      return;

    this.tabs.invoke('removeClassName', 'current');
    tab.addClassName('current');

    this.currentTab = tab;

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


  _setupObservers: function()
  {
    var observeTab = function(tab)
    {
      tab.observe('click', this.selectTab.bind(this));
    }
    this.tabs.each(observeTab.bind(this));
  },


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


  _shouldSelectTab: function(tab)
  {
    var shouldSelect = true;
    if (tab == this.currentTab) shouldSelect = false;
    if (this.shouldSelectTab) shouldSelect = this.shouldSelectTab(tab);
    return shouldSelect;
  },


});


Aphid.UI.SplitViewController = Class.create(Aphid.UI.ViewController, {

  firstView: false,
  secondView: false,

  draggableInstance: false,

  constraint: false, // "horizontal, vertical"

  initialize: function($super, delegate)
  {
    $super(delegate);
  },


  viewDidLoad: function($super)
  {
    $L.info('viewDidLoad', 'Aphid.UI.SplitViewController');
    this.element.addClassName('SplitViewController');


    var minHeight = parseInt(this.firstView.element.getStyle('min-height')),
        maxHeight = parseInt(this.firstView.element.getStyle('max-height'));

    this.draggableInstance = new Aphid.UI.SplitViewController.Draggable(
      this.firstView.element,
      this.secondView.element,
      {
        constraint: 'vertical',
        minHeight: minHeight,
        maxHeight: maxHeight,
        onStart: this.onStart.bind(this),
        onDrag: this.onDrag.bind(this),
        change: this.change.bind(this),
        onEnd: this.onEnd.bind(this)
      });
  },


  onStart: function(arg)
  {
    $L.info("onStart", "Aphid.UI.SplitViewController");
  },

  onDrag: function(arg)
  {
    $L.info("onDrag", "Aphid.UI.SplitViewController");
  },

  change: function(arg)
  {
    $L.info("change", "Aphid.UI.SplitViewController");
  },

  onEnd: function(arg)
  {
    $L.info("onEnd", "Aphid.UI.SplitViewController");
  },

});

/*
 * class Aphid.UI.SplitViewController.Draggable
 *
 * Draggable is a custom subclass of Draggable from script.aculo.us that adds
 * support for minimum/maximum widths and heights, as defined by the
 * min-width and min-height CSS properties.
 *
 * ### TODO
 *
 *  * Move some of the logic out of this to a delegate or callback
**/
Aphid.UI.SplitViewController.Draggable = Class.create(Draggable, {

  firstPane: null,
  secondPane: null,
  dragHandle: null,

  afterResize: null,

  initialize: function($super, firstPane, secondPane)
  {
    var options = arguments[3] || { };
    if (!options.constraint)
      options.constraint = 'horizontal';

    this.firstPane = $(firstPane);
    this.secondPane = $(secondPane);

    this._insertDragHandle(options.constraint);
    $super(this.dragHandle, options);
    this._setupObservers();
    this._initializePaneDimensions();
  },

  updateDrag: function($super, event, pointer)
  {
    $L.info("updateDrag", "Aphid.UI.SplitViewController.Draggable")
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
    this.secondPane.setStyle({ top: (y - this.firstPane.cumulativeOffset()[1] + this.dragHandle.getHeight()) + 'px' });
    this.dragHandle.setStyle({ top: (y - this.firstPane.cumulativeOffset()[1]) + 'px' });
  },


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
      var leftOffset = parseInt(this.dragHandle.getStyle('left')) + parseInt(this.dragHandle.getStyle('width'));
      this.secondPane.setStyle('left: ' + leftOffset + 'px');
    }
  },


  _insertDragHandle: function(constraint)
  {
    this.dragHandle = new Element("div").addClassName("dragHandle");
    this.dragHandle.addClassName(constraint);
    Element.insert(this.firstPane, { after: this.dragHandle });
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
  }

});




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

  barCount: false,

  barSize: false,

  barColor: false,

  centerPosition: false,

  innerRadius: false,

  isAnimating: false,

  /*
   * Aphid.UI.LoadingIndicator#_currentOffset -> Integer
   *
   * Whether or not the loading indicator is currently animating.
  **/
  _currentOffset: 0,

  initialize: function()
  {
    $L.info('Initializing...', 'Aphid.UI.LoadingIndicator');

    this.barCount       = 10;
    this.barSize        = { width: 4, height: 12 };
    this.centerPosition = { x: 48, y: 48 };
    this.innerRadius    = 10;

    this._canvas = new Element("canvas",
      {
        id: "loadingIndicator",
        width: 96,
        height: 96
      }
    );

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

  show: function()
  {
    if (this.isAnimating) return;

    $L.info('Showing the loading indicator...', 'Aphid.UI.LoadingIndicator');

    this._startAnimation();
    var opacity = $(this._canvas).getStyle('opacity');
    this._canvas.appear({ duration: 0.35, to: opacity });
  },

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

  _makeRGBA: function()
  {
    return "rgba(" + [].slice.call(arguments, 0).join(",") + ")";
  }

});

Aphid.UI.ListView = Class.create(Aphid.UI.View, {

  viewName: false,

  items: false,

  selectedItem: false,

  isSortable: false,

  sortableOptions: false,

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


  setItems: function(newItems)
  {
    this.items = this.element.update().insert(newItems).select('>li');
    this._setupObservers();
  },


  selectItem: function(item)
  {
    if (!this._listViewShouldSelectItem(item))
      return;

    $L.info('Selecting item ' + this.items.indexOf(item) + ' in list...', 'Aphid.UI.ListView');

    if (this.selectedItem && this.selectedItem == item)
      return;

    this.clearSelection();
    this.selectedItem = item.addClassName('selected');

    if (this.delegate && this.delegate.listViewSelectionDidChange)
      this.delegate.listViewSelectionDidChange(this, item);
  },

  openItem: function(item)
  {
    if (this.delegate && this.delegate.listViewDidOpenItem)
      this.delegate.listViewDidOpenItem(this, item);
  },

  clearSelection: function()
  {
    this.items.invoke('removeClassName', 'selected');
    this.selectedItem = false;
  },


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
    {
      this.items.invoke('observe', 'click', this._handleClickEvent.bind(this));
      this.items.invoke('observe', 'dblclick', this._handleDoubleClickEvent.bind(this));
    }
  },

  _handleClickEvent: function(event)
  {
    event.stop();
    var item = event.findElement('li');
    this.selectItem(item);
  },

  _handleDoubleClickEvent: function(event)
  {
    event.stop();
    var item = event.findElement('li');
    this.selectItem(item);
    this.openItem(item);
  },


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
