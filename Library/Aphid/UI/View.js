/**
 * class Aphid.UI.View
 *
 * This class serves as a lightweight wrapper for a DOM element and as a
 * scaffold on which to build functionality on top of the wrapped HTML.
 *
 * **TODO** Document the 3 ways that views can be initialized: from an element,
 * a template or an outlet...
 *
 * ### Implementing Custom Views
 *
 * In general, [[Aphid.UI.View]] should be subclassed and not initialized
 * directly so that you may implement the functionality that is specific to
 * your custom view's requirements. To implement a custom view, simply create
 * a subclass of [[Aphid.UI.View]]:
 *
 *     var FooBarView = Class.create(Aphid.UI.View, {
 *       displayName: "FooBarView",
 *       fooLabel: false,
 *       contentView: false,
 *       viewDidLoad: function()
 *       {
 *         this.fooLabel.element.update('Bar!');
 *       }
 *     });
 *
 * In this example, the `displayName` property specifies the name of the view
 * itself. This will be used to load the template (see the *View Templates*
 * section below for more details). The `fooLabel` and `contentView`
 * properties are outlets that will be wired up to elements within the view
 * template. Finally, the [[Aphid.UI.View#viewDidLoad]] method is called
 * once the view has loaded and in this example we are implementing this
 * method in our subclass so that we can set the new label on our `fooLabel`
 * outlet.
 *
 * ### View Templates
 *
 * View templates are loaded asynchronously when the instance is first
 * initialized. The view template itself should be located in the path
 * that is defined by the `baseViewPath` instance property on your Application
 * delegate (which defaults to the relative path of *Views*). The filename of
 * the template should match the value of the [[Aphid.UI.View#displayName]]
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
 * the `displayName` instance property.
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
 * #### Delegates & Data Sources on Outlets
 *
 * By default, delegates and data sources (if applicable) will be
 * automatically assigned to the view that owns the outlet.
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
 * ### Callback Methods
 *
 * The following methods may be implemented by your custom subclass of
 * [[Aphid.UI.View]]:
 *
 *  - [[Aphid.UI.View#viewDidLoad]]
 *    Called once the view has been loaded and initialized.
 *
 * ### Delegate Methods
 *
 * The following methods may be implemented by your class that serves as the
 * delegate for an instance of [[Aphid.UI.View]]:
 *
 *  - [[Aphid.UI.View#viewDidLoadAsynchronously]]
 *    Called once the view template has finished loading and the view is in a
 *    fully initialized state.
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
   * Aphid.UI.View#displayName -> String
   *
   * A friendly displayName for the view. Defining this property can help
   * track down issues as it will be used when logging errors and warnings or
   * other informational messages.
  **/
  displayName: false,

  /**
   * Aphid.UI.View#template -> String
   *
   * The base filename of the view template that should be loaded for this
   * view.
   *
   * For example, if *template* is set to "MainView", Aphid will attempt to
   * load *Views/MainView.html*. The directory in which view templates are
   * loaded from is managed by the Application delegate's baseViewPath
   * property.
  **/
  template: false,

  /**
   * Aphid.UI.View#element -> Element
   *
   * The root HTML element that contains the view.
  **/
  element: false,

  /**
   * Aphid.UI.View#outlet -> Element
   *
   * The HTML element that defines an outlet that references the view that
   * should be loaded.
  **/
  outlet: false,

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

  /**
   * Aphid.UI.View#isEnabled -> Boolean
   *
   * Denotes whether or not the view is considered to be enabled. Subviews
   * and controls may query this property to check whether or not they should
   * act on any events or actions.
  **/
  isEnabled: true,

  /**
   * Aphid.UI.View#initializedFromTemplate -> Boolean
   *
   * If the View instance was initialized from a template (using outlets),
   * this will be set to true.
  **/
  initializedFromOutlet: false,

  /**
   * Aphid.UI.View#asynchronousLoadingEnabled -> Boolean
   *
   * If the true, view templates will be loaded asynchronously from the
   * server.
  **/
  asynchronousLoadingEnabled: false,

  // Initializers ------------------------------------------------------------

  /**
   * new Aphid.UI.View([options])
   *
   * - options (Hash): Initial property values to be set on the View instance
   *
   * Initializes a new View instance.
  **/
  initialize: function(options)
  {
    Object.applyOptionsToInstance(this, options);

    // Default State
    this.subviews  = $A();
    this.isLoaded  = false;
    this.isLoading = false;

    // Initialize from Outlet
    if (this.outlet)
      this._initializeFromOutlet();

    // Initialize from Element
    else if (this.element)
      this._initializeFromElement();

    // Initialize from Template
    else if (this.template)
      this._initializeFromTemplate();

  },

  _initializeFromElement: function()
  {
    $L.info("Initializing from Element", "Aphid.UI.View");
    this._setupView();
  },

  _initializeFromTemplate: function()
  {
    $L.info("Initializing from Template", "Aphid.UI.View");
    this._loadTemplate();
  },

  _initializeFromOutlet: function()
  {
    $L.info("Initializing from Outlet", "Aphid.UI.View");
    if (this.template)
      this._initializeFromTemplate();
    else
    {
      this.element = this.outlet;
      this._setupView();
    }
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

    $L.info('Adding "' + (view.displayName || "Unknown") + '" as a subview to "' + (this.displayName || "unknown") + '" (animated: ' + animated + ')', 'Aphid.UI.View');

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
    this.superview.subviews.remove(this);

    // Remove reference to superview
    this.superview = false;

    // "View Did Disappear"
    // TODO if animated, this needs to be called when the animation has completed instead...
    if (this.viewDidDisappear)
      this.viewDidDisappear();
  },

  // View Loading ------------------------------------------------------------

  /*
   * Aphid.UI.View#_loadTemplate() -> null
   *
   * Loads the View template (as derived from the *template* and
   * *Application.baseViewPath* properties) asynchronously.
  **/
  _loadTemplate: function()
  {
    var viewPath = Application.sharedInstance.baseViewPath + '/' + this.template + '.html',
        options  = {
          asynchronous: this.asynchronousLoadingEnabled,
          method: 'get',
          onComplete: this._templateDidFinishLoading.bind(this),
          onFailure: function(transport)
          {
            if (transport.status == 404)
              $L.error("Missing Template (" + Application.sharedInstance.baseViewPath + "/" + this.template + ".html)", "Aphid.UI.View");
          }.bind(this)
        };

    this.isLoaded  = false;
    this.isLoading = true;

    new Ajax.Request(viewPath, options);
  },

  /*
   * Aphid.UI.View#_templateDidFinishLoading(transport) -> null
   *
   * Callback method that is called once the view has finished loading
   * asynchronously. This method sets up the View instance by wiring any
   * outlets and actions found in the template and then calls the appropriate
   * delegate methods.
   *
   * TODO This method should probably just be viewDidFinishLoading so that subclasses can call it instead of making it a delegate call
   *
  **/
  _templateDidFinishLoading: function(transport)
  {
    var loadedTemplate = Element.fromString(transport.responseText);

    // If the view was initialized from a template, we need to insert the
    // template into the placeholder element that initialized the view
    // instance.
    if (this.outlet)
    {
      this.element = this.outlet.update(loadedTemplate);
      // // TODO We may need to ensure that we aren't doubling-up on the wrapper element with the same ID, etc...
      // this.element.update(template);
    }

    // // Otherwise, set the template directly on the object and let its delegate
    // // deal with it.
    else
    {
      if (Object.isElement(loadedTemplate))
        this.element = loadedTemplate;
      else
        this.element = new Element("section", { className: "view" }).update(transport.responseText);
    }

    // Process the template by connecting outlets and actions and calling any
    // callbacks and delegate methods.
    this._setupView();
  },

  // View Processing ---------------------------------------------------------

  /*
   * Aphid.UI.View#_setupView() -> null
   *
   * Processes the view template which has already been loaded remotely or was
   * present in the page when initialized with an element. This will connect
   * all outlets and actions to the view instance and call the appropriate
   * callbacks.
  **/
  _setupView: function()
  {
    // Wire Outlets & Actions
    this._connectToOutlets();
    this._wireActionsToInstance();

    // Set Loaded State
    this.isLoaded  = true;
    this.isLoading = false;

    // Determine Enabled State
    if (this.element.hasClassName("disabled"))
      this.disable();
    else if (this.isEnabled)
      this.enable();
    else
      this.disable();

    // Notify Callbacks & Delegates
    this.viewDidLoad();
    if (this.asynchronousLoadingEnabled)
      if (this.delegate && this.delegate.viewDidLoadAsynchronously)
        this.delegate.viewDidLoadAsynchronously(this);
  },

  // View "Enabled" State ----------------------------------------------------

  /**
   * Aphid.UI.View#enable() -> null
   *
   * Sets the view to a enabled state by setting [[Aphid.UI.View#isEnabled]]
   * to `true` and removing the `disabled` CSS class from [[Aphid.UI.View#elament]],
   * if present.
  **/
  enable: function()
  {
    this.isEnabled = true;
    if (!this.isLoaded) return;
    this.element.removeClassName("disabled");
  },

  /**
   * Aphid.UI.View#disable() -> null
   *
   * Sets the view to a disabled state by setting [[Aphid.UI.View#isEnabled]]
   * to `false` and adding the `disabled` CSS class to [[Aphid.UI.View#elament]].
  **/
  disable: function()
  {
    this.isEnabled = false;
    if (!this.isLoaded) return;
    this.element.addClassName("disabled");
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
    if (this.element.childElements().length == 0) return;

    var outletElements = this.element.select('*[data-outlet]');
    $L.debug('Found ' + outletElements.length + ' ' + "outlet".pluralize(outletElements.length) + ' in the view (' + this.displayName + ')...', 'Aphid.UI.View');

    outletElements.each(
      function(element)
      {
        var outlet    = element.getAttribute('data-outlet'),
            viewClass = element.getAttribute('data-view-class');

        // If a custom view class was not provided, default to Aphid.UI.View
        if (!viewClass)
        {
          viewClassImplementation = eval("Aphid.UI.View");
          viewClass = "Aphid.UI.View";
        }
        else
          viewClassImplementation = eval(viewClass);

        if (!Object.isUndefined(this[outlet]))
        {
          var instance;
          $L.info('Connecting outlet "' + outlet + '" to view (class: ' + viewClass + ')...', 'Aphid.UI.View');
          try {

            // Set options from data-* attributes...
            var options = $H();
            $H(viewClassImplementation.prototype).keys().each(
              function(property)
              {
                // Disallow Private Properties
                if (property.startsWith('_'))
                  return;
                // Disallow Functions
                if (Object.isFunction(viewClassImplementation.prototype[property]))
                  return;
                var value;
                if ((value = element.readAttribute("data-" + property.attributize())) != null)
                {
                  if (value == "true") value = true;
                  if (value == "false") value = false;
                  options.set(property, value);
                }
              }
            );
            instance = new viewClassImplementation(options.merge({
              outlet: element,
              delegate: this,
              dataSource: this,
              superview: this
            }));
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
    if (this.element.childElements().length == 0) return;

    var actionElements = this.element.select('*[data-action]');
    $L.debug('Found ' + actionElements.length + ' ' + "action".pluralize(actionElements.length) + ' in the view (' + this.displayName + ')...', 'Aphid.UI.View');

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

  // Callback Methods (Abstract) ---------------------------------------------

  /**
   * Aphid.UI.View#viewDidLoad() -> null
   *
   * **Abstract Method** — A *callback method* that is called once the view
   * has finished loading and all of its outlets and actions have been wired
   * to the View instance.
   *
   * You should override this method in your View subclasses if you need to
   * perform any additional setup once the view has been loaded and
   * initialized (i.e. setting the initial view state).
   *
   * ### Example
   *
   *     var FooBarView = Class.create(Aphid.UI.View, {
   *       displayName: "FooBarView",
   *       fooLabel: false,
   *       contentView: false,
   *       viewDidLoad: function()
   *       {
   *         this.fooLabel.element.update('Bar!');
   *       }
   *     });
   *
   * ### Asynchronous Loading Caveat
   *
   * When asynchronous loading is enabled, the `viewDidLoad` method *may* be
   * called before the view's subviews, such as those that have been
   * initialized from outlets, have been completely loaded and initialized. If
   * you need to know when all subviews have been completely loaded, you
   * should implement the [[Aphid.UI.View#viewDidLoadAsynchronously]] delegate method
   * in your view.
   *
  **/
  viewDidLoad: function()
  {
    // Abstract Method Definition
  },

  // Delegate Methods --------------------------------------------------------

  /**
   * Aphid.UI.View#viewDidLoadAsynchronously([view]) -> null
   *
   * - view ([[Aphid.UI.View]]): the view instance that was loaded
   *
   * **Delegate Method**
  **/
  // TODO This should be defined as a mixin (i.e. Aphid.UI.View.DelegateMethods)
  viewDidLoadAsynchronously: function(view)
  {
    // Delegate Method Definition
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
Aphid.UI.View.prototype._loadTemplate.displayName = "Aphid.UI.View._loadTemplate";
Aphid.UI.View.prototype._templateDidFinishLoading.displayName = "Aphid.UI.View._templateDidFinishLoading";
Aphid.UI.View.prototype._connectToOutlets.displayName = "Aphid.UI.View._connectToOutlets";
Aphid.UI.View.prototype._wireActionsToInstance.displayName = "Aphid.UI.View._wireActionsToInstance";
