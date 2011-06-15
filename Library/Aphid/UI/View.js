/**
 * class Aphid.UI.View < Aphid.Support.Object
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
 *         this.get("fooLabel.element").update('Bar!');
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
 *  - [[Aphid.UI.View#viewWillAppear]]
 *    Called before the view is displayed.
 *
 *  - [[Aphid.UI.View#layoutSubviews]]
 *    Called before the view is displayed or any time the view is resized or
 *    otherwise changes.
 *
 *  - [[Aphid.UI.View#viewDidAppear]]
 *    Called after the view has been displayed.
 *
 *  - [[Aphid.UI.View#viewWillDisappear]]
 *    Called before the view will be removed from display.
 *
 *  - [[Aphid.UI.View#viewDidDisappear]]
 *    Called after the view has been displayed.
 *
 *  - [[Aphid.UI.View#viewDidScroll]]
 *    Called after the view scroll offset has changed. This may be called many
 *    times as the view continues to scroll.
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
 *  - [[Aphid.UI.View#viewScrollOffsetDidChange]]
 *    Called when the scroll offset of the view has changed.
 *
**/

Aphid.UI.View = Aphid.Class.create("Aphid.UI.View", Aphid.Support.Object, {

  /**
   * Aphid.UI.View#tagName -> String
   *
   * The default tag name to use for empty views.
  **/
  tagName: "section",

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
   * Aphid.UI.View#hidden -> Boolean
   *
   * Denotes whether or not the view is currently visible to the user. This
   * will be false unless the view has been explicitly hidden with the hide()
   * or hideAnimated() methods. Setting this property to true is equivalent
   * to setting the element style "visibility" to "hidden", but it also has
   * other behind-the-scenes implications.
  **/
  hidden: false,

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
  initialize: function($super, options)
  {
    // Set Default State
    this.subviews  = $A();
    this.isLoaded  = false;
    this.isLoading = false;
    this.hidden    = false;

    $super(options);

    // Initialize from Outlet
    if (this.outlet)
      this._initializeFromOutlet();

    // Initialize from Element
    else if (this.element)
      this._initializeFromElement();

    // Initialize from Template
    else if (this.template)
      this._initializeFromTemplate();

    // Initialize an Empty View
    else
      this._initializeEmptyView();
  },

  _initializeFromElement: function()
  {
    $L.debug("Initializing from Element", this);
    this._setupView();
  },

  _initializeFromTemplate: function()
  {
    $L.debug("Initializing from Template", this);
    this._loadTemplate();
  },

  _initializeFromOutlet: function()
  {
    $L.debug("Initializing from Outlet", this);
    if (this.get("template"))
      this._initializeFromTemplate();
    else
    {
      this.set("element", this.get("outlet"));
      this._setupView();
    }
  },

  _initializeEmptyView: function()
  {
    $L.debug("Initializing Empty View", this);
    this.element = new Element(this.get("tagName"));
    this._setupView();
  },

  // Element -----------------------------------------------------------------

  getElement: function()
  {
    if (!this.element)
      this.element = new Element(this.get("tagName"));
    return this.element;
  },

  // View Management ---------------------------------------------------------

  /**
   * Aphid.UI.View#setView(view) -> null
   *
   * - view ([[Aphid.UI.View]]): the view that should be set
   *
   * Clears all subviews of the current view and sets the specified *view* as
   * the current view's only subview.
  **/
  setView: function(view)
  {
    this._setView(view, false);
  },

  /**
   * Aphid.UI.View#setViewAnimated(view[, animated = true[, transition = Aphid.UI.View.FadeTransition]]) -> null
   *
   * - view ([[Aphid.UI.View]]): the view that should be set
   * - animated (Boolean): true if the view should be presented with animation
   * - transition (Integer): A transition that should be used if animated is
   *   enabled (defaults to [[Aphid.UI.View.FadeTransition]])
   *
   * Clears all subviews of the current view and presents the specified *view*
   * with an animated effect (currently this effect is *appear*).
  **/
  setViewAnimated: function(view, animated, transition)
  {
    if (Object.isUndefined(animated)) animated = true;
    if (animated && Object.isUndefined(transition)) transition = Aphid.UI.View.FadeTransition;
    this._setView(view, animated, transition);
  },

  /*
   * Aphid.UI.View#_setView(view[, animated = false]) -> null
   *
   * - view ([[Aphid.UI.View]]): the view that should be set
   * - animated (Boolean): true if the view should be presented with animation
   *
   * Clears all subviews of the current view and presents the specified *view*
   * with an animated effect (currently this effect is *appear*).
   */
  _setView: function(view, animated, transition)
  {
    if (Object.isUndefined(animated)) animated = false;
    if (animated && Object.isUndefined(transition)) transition = Aphid.UI.View.FadeTransition;

    // If the passed view is already a subview, simply remove all other
    // subviews (without animation).
    if (view && this.get("subviews").include(view))
    {
      this.get("subviews").each(function(subview) {
        if (subview == view) return;
        subview.removeFromSuperview();
      });
      return;
    }

    // Otherwise, clear all of the subviews...
    else
      this.clearSubviews(animated, transition);

    if (view)
    {

      // Reset Positioning
      if (view.get("element").getStyle("position") == "absolute")
        view.get("element").setStyle({ top: 0, left: 0, right: 0, bottom: 0 });

      // Add the specified view as the view's only subview
      this.addSubviewAnimated(view, animated, transition);

    }
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
   * Aphid.UI.View#addSubviewAnimated(view[, animated = true[, transition = Aphid.UI.View.FadeTransition]]) -> null
   *
   * - view ([[Aphid.UI.View]]): the view that should be set
   * - animated (Boolean): true if the view should be presented with animation
   * - transition (Integer): A transition that should be used if animated is
   *   enabled (defaults to [[Aphid.UI.View.FadeTransition]])
   *
   * Adds the specified *view* as a subview of the view instance and presents
   * it with an animated effect, by default.
  **/
  addSubviewAnimated: function(view, animated, transition)
  {
    if (Object.isUndefined(animated)) animated = true;
    if (animated && Object.isUndefined(transition)) transition = Aphid.UI.View.FadeTransition;

    // If the view is loading, we need to wait for it to finish loading before
    // we can add it to the DOM.
    if (view.isLoading)
      this._addSubview.bind(this).delay(0.1, view, animated, transition);

    // Otherwise, we can add it immediately.
    else
      this._addSubview(view, animated, transition);
  },

  /*
   * Aphid.UI.View#_addSubview(view[, animated = false[, transition = Aphid.UI.View.FadeTransition]]) -> null
   *
   * - view ([[Aphid.UI.View]]): the view that should be added
   * - animated (Boolean): true if the view should be presented with animation
   * - transition (Integer): A transition that should be used if animated is
   *   enabled (defaults to [[Aphid.UI.View.FadeTransition]])
   *
   * Adds the specified *view* as a subview of the view instance and optionally
   * presents it with an animated effect.
   */
  _addSubview: function(view, animated, transition)
  {
    if (Object.isUndefined(animated)) animated = false;
    if (animated && Object.isUndefined(transition)) transition = Aphid.UI.View.FadeTransition;

    // Do not set the view if the view is already the only subview
    // TODO Need to track down a bug with ListViews that add items twice
    if (this.get("subviews").include(view))
      return;

    // If the view has still not been loaded, delay this call again...
    if (!view.get("isLoaded"))
    {
      // TODO We need to add a counter to this so that we don't wait longer
      // a few seconds before giving up and raising a warning...
      this._addSubview.bind(this).delay(0.1, view, animated, transition);
      return;
    }

    $L.debug('Adding "' + (view.displayName || "Unknown") + '" as a subview to "' + (this.displayName || "unknown") + '" (animated: ' + animated + ', transition: ' + transition + ')', this);

    // Setup the View
    view.get("element").setStyle({ "visibility": "hidden" }).show();
    view.set("superview", this);
    this.get("subviews").push(view);

    // Insert the view into the DOM
    this.get("element").insert(view.get("element"));

    // Call "View Will Appear" Callback
    this._viewWillAppear(animated);

    // Make Subview Visible, if necessary
    if (this.get("hidden") || view.get("hidden"))
    {
      if (!view.get("hidden"))
        view.get("element").setStyle({ "visibility": "visible", opacity: 1 });
      this._viewDidAppear(animated);
    }

    // Display Animated
    else if (animated)
    {
      view.get("element").setStyle({ "visibility": "visible", "opacity": 0 });
      switch (transition)
      {
        case Aphid.UI.View.SlideLeftTransition:
          view.get("element").setStyle({
            left: this.get("element").getWidth() + "px",
            right: -this.get("element").getWidth() + "px"
          });
          view.get("element").morph({
            left: "0px",
            right: "0px"
          },
          {
            duration: 0.35,
            transition: Effect.Transitions.sinoidal,
            afterFinish: this._viewDidAppear.bind(this, animated)
          });
          new Effect.Opacity(view.get("element"), {
            to: 1,
            duration: 0.35
          });
          break;
        case Aphid.UI.View.SlideRightTransition:
          view.get("element").setStyle({
            left: -this.get("element").getWidth() + "px",
            right: this.get("element").getWidth() + "px"
          });
          view.get("element").morph({
            left: "0px",
            right: "0px"
          },
          {
            duration: 0.35,
            transition: Effect.Transitions.sinoidal,
            afterFinish: this._viewDidAppear.bind(this, animated)
          });
          new Effect.Opacity(view.get("element"), {
            to: 1,
            duration: 0.35
          });
          break;
        default:
          view.get("element").appear({
            duration: 0.25,
            queue: { scope: view.scopeIdentifier(), position: "end" },
            afterFinish: this._viewDidAppear.bind(this, animated)
          });
          break;
      }
    }

    // Display Immediately
    else
    {
      view.get("element").setStyle({ "visibility": "visible", "opacity": 1 });
      this._viewDidAppear(animated);
    }
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
   * Aphid.UI.View#removeFromSuperviewAnimated([animated = true[, transition = Aphid.UI.View.FadeTransition]]) -> null
   *
   * - animated (Boolean): true if the view should be dismissed with animation
   * - transition (Integer): A transition that should be used if animated is
   *   enabled (defaults to [[Aphid.UI.View.FadeTransition]])
   *
   * Removes the view from its superview, with an optional animated effect.
   * This method will return immediately if the view does not belong to a
   * superview.
  **/
  removeFromSuperviewAnimated: function(animated, transition)
  {
    if (Object.isUndefined(animated)) animated = true;
    if (animated && Object.isUndefined(transition)) transition = Aphid.UI.View.FadeTransition;
    this._removeFromSuperview(animated, transition);
  },

  /*
   * Aphid.UI.View#_removeFromSuperview([animated = false[, transition = Aphid.UI.View.FadeTransition]]) -> null
   *
   * - animated (Boolean): true if the view should be dismissed with animation
   * - transition (Integer): A transition that should be used if animated is
   *   enabled (defaults to [[Aphid.UI.View.FadeTransition]])
   *
   * Removes the view from its superview, with an optional animated effect.
   * This method will return immediately if the view does not belong to a
   * superview.
   */
  _removeFromSuperview: function(animated, transition)
  {
    if (Object.isUndefined(animated)) animated = false;
    if (animated && Object.isUndefined(transition)) transition = Aphid.UI.View.FadeTransition;

    if (!this.get("superview")) return;

    $L.debug('Removing "' + (this.displayName || "Unknown") + '" from superview to "' + (this.get("superview").displayName || "unknown") + '" (animated: ' + animated + ', transition: ' + transition + ')', this);

    // Call "View Will Disappear" Callback
    this._viewWillDisappear(animated);

    // Hide the View
    if (animated)
    {
      switch(transition)
      {
        case Aphid.UI.View.SlideLeftTransition:
          this.get("element").morph({
            left: -(this.get("element").getWidth()) + "px",
            right: (this.get("element").getWidth()) + "px"
          },
          {
            duration: 0.35,
            transition: Effect.Transitions.sinoidal,
            afterFinish: this._viewDidDisappear.bind(this, animated)
          });
          new Effect.Opacity(this.get("element"), {
            to: 0,
            duration: 0.35
          });
          break;
        case Aphid.UI.View.SlideRightTransition:
          this.get("element").morph({
            left: (this.get("element").getWidth()) + "px",
            right: -(this.get("element").getWidth()) + "px"
          },
          {
            duration: 0.35,
            transition: Effect.Transitions.sinoidal,
            afterFinish: this._viewDidDisappear.bind(this, animated)
          });
          new Effect.Opacity(this.get("element"), {
            to: 0,
            duration: 0.35
          });
          break;
        default:
          this.get("element").fade({
            duration: 0.25,
            queue: { scope: this.scopeIdentifier(), position: "end" },
            afterFinish: this._viewDidDisappear.bind(this, animated)
          });
          break;
      }

      // Remove the View's element from the DOM
      if (this.get("element").parentNode !== null)
        this.get("element").remove.delay.bind(this, 0.35);

    }
    else
    {

      // Hide the Element
      this.get("element").hide();

      // Remove the View's element from the DOM
      if (this.get("element").parentNode !== null)
        this.get("element").remove();

    }

    // Remove from superview's subviews
    this.get("superview.subviews").remove(this);

    // Remove reference to superview
    this.set("superview", false);

    // Call "View Did Disappear" Callback
    if (!animated) this._viewDidDisappear(animated);
  },

  /**
   * Aphid.UI.View#clearSubviews([animated = false[, transition = Aphid.UI.View.FadeTransition]]) -> null
   *
   * Removes all subviews from the view.
  **/
  clearSubviews: function(animated, transition)
  {
    if (Object.isUndefined(animated)) animated = false;
    if (animated && Object.isUndefined(transition)) transition = Aphid.UI.View.FadeTransition;

    // Remove existing views
    this.get("subviews").invoke('removeFromSuperviewAnimated', animated, transition);

    // Clear the Subviews
    this.set("subviews", $A());
  },

  /**
   * Aphid.UI.View#superviews() -> Array
   *
   * Returns an array containing each of the view's superviews (ordered from
   * the immediate superview to the top superview).
  **/
  superviews: function()
  {
    var superviews  = $A(),
        currentView = this,
        superview   = false;
    while ((superview = currentView.get("superview")))
    {
      superviews.push(superview);
      currentView = superview;
    }
    return superviews;
  },

  // View Loading ------------------------------------------------------------

  /*
   * Aphid.UI.View#_loadTemplate() -> null
   *
   * Loads the View template (as derived from the *template* and
   * *Application.baseViewPath* properties) asynchronously.
   */
  _loadTemplate: function()
  {
    var viewPath = $AppDelegate.baseViewPath + '/' + this.template + '.html?' + $AppDelegate.buildstamp(),
        options  = {
          asynchronous: this.asynchronousLoadingEnabled,
          method: 'get',
          onSuccess: this._templateDidFinishLoading.bind(this),
          onFailure: this._templateRequestDidFail.bind(this),
          onException: function(transport, exception) { throw exception; }
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
   */
  _templateDidFinishLoading: function(transport)
  {
    var loadedTemplate = Element.fromString(transport.responseText);

    // If the view was initialized from a template, we need to insert the
    // template into the placeholder element that initialized the view
    // instance.
    if (this.outlet)
    {
      // Update the view's element to the outlet element and add all child
      // elements from the loaded template to the outlet element so that we're
      // not double-wrapping the view (i.e. the template may have the same
      // DOM ID in its wrapper as the outlet).
      this.set("element", this.get("outlet").update().insert(loadedTemplate.childElements()));
      // The old way... this.element = this.outlet.update(loadedTemplate);
    }

    // Otherwise, set the template directly on the object and let its delegate
    // deal with it.
    else
    {
      if (Object.isElement(loadedTemplate))
        this.set("element", loadedTemplate);
      else
        this.set("element", new Element(this.get("tagName")).update(transport.responseText));
    }

    // Process the template by connecting outlets and actions and calling any
    // callbacks and delegate methods.
    this._setupView();
  },

  _templateRequestDidFail: function(transport)
  {
    var templatePath = $AppDelegate.baseViewPath + "/" + this.get("template") + ".html";

    if (transport.status == 404)
    $L.error("Faild to load template \"" + templatePath + "\" (Error " + transport.status + " - " + transport.statusText + ")", this);

    var alertView = new Aphid.UI.AlertView();
    alertView.set("title", "Error Loading Template");
    alertView.set("message", "Failed to load template at path <strong>" + templatePath + "</strong> for <strong>" + this.displayName + "</strong>.");
    alertView.set("status", "Error " + transport.status + " - " + transport.statusText);
    alertView.showAnimated();
  },

  // View Processing ---------------------------------------------------------

  /*
   * Aphid.UI.View#_setupView() -> null
   *
   * Processes the view template which has already been loaded remotely or was
   * present in the page when initialized with an element. This will connect
   * all outlets and actions to the view instance and call the appropriate
   * callbacks.
   */
  _setupView: function()
  {
    // Store View Instance on Element
    this.get("element").store("view", this);

    // Wire Outlets & Actions
    this._connectToOutlets();
    this._wireActionsToInstance();

    // Set Loaded State
    this.isLoaded  = true;
    this.isLoading = false;

    // Add CSS Class Names
    this._addClassNames();

    // Determine Enabled State
    if (this.get("element").hasClassName("disabled"))
      this.disable();
    else if (this.get("isEnabled"))
      this.enable();
    else
      this.disable();

    // Determine Hidden State
    if (!this.get("hidden") && this.get("element").getStyle("visibility") == "hidden")
      this.set("hidden", true);
    else if (this.get("hidden"))
      this.set("hidden", true);
    else
      this.set("hidden", false);

    // Notify Callbacks & Delegates
    this.viewDidLoad();
    if (this.asynchronousLoadingEnabled)
      if (this.delegate && this.delegate.viewDidLoadAsynchronously)
        this.delegate.viewDidLoadAsynchronously(this);
  },

  /*
   * Aphid.UI.View#_addClassNames() -> null
   *
   * Traverses the view stack, adding a CSS class to the view for each of its
   * superclasses. The CSS class name used is the last component of the
   * displayName property of each superclass (i.e. "View" for "Aphid.UI.View").
   */
  _addClassNames: function()
  {
    var klass = this;
    while (!Object.isUndefined(klass.displayName))
    {
      var className = klass.displayName.split(".").last();
      this.get("element").addClassName(className);
      klass = klass.constructor.superclass.prototype;
    }
  },

  // View "Enabled" State ----------------------------------------------------

  /**
   * Aphid.UI.View#enable() -> [[Aphid.UI.View]]
   *
   * Sets the view to a enabled state by setting [[Aphid.UI.View#isEnabled]]
   * to `true` and removing the `disabled` CSS class from [[Aphid.UI.View#elament]],
   * if present. Returns the view that was enabled.
  **/
  enable: function()
  {
    this.isEnabled = true;
    if (!this.isLoaded) return;
    this.get("element").removeClassName("disabled");
    this._startObserving();
    return this;
  },

  /**
   * Aphid.UI.View#disable() -> [[Aphid.UI.View]]
   *
   * Sets the view to a disabled state by setting [[Aphid.UI.View#isEnabled]]
   * to `false` and adding the `disabled` CSS class to [[Aphid.UI.View#elament]].
   * Returns the view that was disabled.
  **/
  disable: function()
  {
    this.isEnabled = false;
    if (!this.isLoaded) return;
    this.get("element").addClassName("disabled");
    this._stopObserving();
    return this;
  },

  // View "Visible" State ----------------------------------------------------

  /**
   * Aphid.UI.View#setHidden(hidden) -> Boolean
   *
   * Sets the visible state of the view.
  **/
  setHidden: function(hidden)
  {
    this.hidden = (hidden === true);

    if (this.hidden)
      this.get("element").setStyle("visibility: hidden");
    else
      this.get("element").setStyle("visibility: visible");

    return this.hidden;
  },

  /**
   * Aphid.UI.View#hide() -> [[Aphid.UI.View]]
   *
   * Sets the view to a hidden state by setting [[Aphid.UI.View#hidden]]
   * to `true` and returning the view.
  **/
  hide: function()
  {
    this.get("element").setStyle({ opacity: 0 });
    this.set("hidden", true);
    return this;
  },

  /**
   * Aphid.UI.View#hideAnimated() -> [[Aphid.UI.View]]
   *
   * Sets the view to a hidden state by setting [[Aphid.UI.View#hidden]]
   * to `true` and hiding the [[Aphid.UI.View#element]] with a fade-out
   * animation effect. Returns the view that was hidden.
  **/
  hideAnimated: function()
  {
    new Effect.Opacity(this.get("element"), {
      to: 0,
      duration: 0.35
    });
    this.hide.bind(this).delay(0.35);
    return this;
  },

  /**
   * Aphid.UI.View#show() -> [[Aphid.UI.View]]
   *
   * Sets the view to a visibile state by setting [[Aphid.UI.View#hidden]]
   * to `false` and returning the view.
  **/
  show: function(animated)
  {
    this.get("element").setStyle({ opacity: 1 });
    this.set("hidden", false);
    return this;
  },

  /**
   * Aphid.UI.View#showAnimated() -> [[Aphid.UI.View]]
   *
   * Sets the view to a visibile state by setting [[Aphid.UI.View#hidden]]
   * to `false` and displaying the [[Aphid.UI.View#element]] with a fade-in
   * animation effect. Returns the view that was displayed.
  **/
  showAnimated: function()
  {
    new Effect.Opacity(this.get("element"), {
      to: 1,
      duration: 0.35
    });
    this.show.bind(this).delay(0.35);
    return this;
  },

  /**
   * Aphid.UI.View#visible() -> Boolean
   *
  **/
  visible: function()
  {
    var visible = true;

    // View Hidden?
    if (this.get("hidden"))
      return false;

    // View Opacity > 0?
    if (this.get("element").getStyle("opacity") <= 0)
      return false;

    // TODO Is visible within the viewport?

    // All Superviews Visible?
    var hiddenSuperviews = this.get("superviews").find(function(superview) {
      return !superview.get("visible");
    });
    if (hiddenSuperviews) return false;

    return true;
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
   */
  _connectToOutlets: function()
  {
    if (this.get("element").childElements().length === 0) return;

    var outletElements = this.get("element").select('*[data-outlet]');
    $L.debug('Found ' + outletElements.length + ' ' + "outlet".pluralize(outletElements.length) + ' in the view (' + this.displayName + ')...', this);

    outletElements.each(
      function(element)
      {
        var outlet    = element.getData('outlet'),
            viewClass = element.getData('view-class'),
            viewClassImplementation;

        var parentViewElement = element.up("*[data-view-class]");
        if (parentViewElement)
        {
          var parentViewClass = parentViewElement.getData("view-class");
          if (this.displayName != parentViewClass)
          {
            $L.debug('Not connecting outlet "' + outlet + '" to view because the outlet belongs to "' + parentViewClass + '"', this);
            return;
          }
        }

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
          $L.debug('Connecting outlet "' + outlet + '" to view (class: ' + viewClass + ')...', this);
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
                if ((value = element.readAttribute("data-" + property.attributize())) !== null)
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
            $L.error("Unable to connect outlet (" + outlet + ") to view class (" + viewClass + ")... " + error, this);
            return;
          }
          this[outlet] = instance;
          this.get("subviews").push(instance);
        }
        else
          $L.warn('Unable to connect outlet "' + outlet + '" to view controller as the controller does not define a matching member variable', this);
      }.bind(this)
    );
  },

  // Events ------------------------------------------------------------------

  _startObserving: function()
  {

    // Scroll Events (Always Observed)
    // TODO Make a ScrollView subclass of View to handle more scrolling specifics
    if (!this._handleScrollEventListener)
    {
      $L.debug("Observing for Scroll Events", this);
      this._handleScrollEventListener = this._handleScrollEvent.bindAsEventListener(this);
      this.get("element").observe("scroll", this._handleScrollEventListener);
    }

    // Focus Events
    if (this.handleFocusEvent && !this._handleFocusEventListener)
    {
      $L.debug("Observing for Focus Events", this);
      this._handleFocusEventListener = this._handleFocusEvent.bindAsEventListener(this);
      this.get("element").observe("focus", this._handleFocusEventListener);
    }

    // Blur Events
    if (this.handleBlurEvent && !this._handleBlurEventListener)
    {
      $L.debug("Observing for Blur Events", this);
      this._handleBlurEventListener = this._handleBlurEvent.bindAsEventListener(this);
      this.get("element").observe("blur", this._handleBlurEventListener);
    }

    // Click Events
    if (this.handleClickEvent && !this._handleClickEventListener)
    {
      $L.debug("Observing for Click Events", this);
      this._handleClickEventListener = this._handleClickEvent.bindAsEventListener(this);
      this.get("element").observe("click", this._handleClickEventListener);
    }

    // Double-Click Events
    if (this.handleDoubleClickEvent && !this._handleDoubleClickEventListener)
    {
      $L.debug("Observing for Double-Click Events", this);
      this._handleDoubleClickEventListener = this._handleDoubleClickEvent.bindAsEventListener(this);
      this.get("element").observe("dblclick", this._handleDoubleClickEventListener);
    }

    // Mouse Down Events
    if (this.handleMouseDownEvent && !this._handleMouseDownEventListener)
    {
      $L.debug("Observing for Mouse Down Events", this);
      this._handleMouseDownEventListener = this._handleMouseDownEvent.bindAsEventListener(this);
      this.get("element").observe("mousedown", this._handleMouseDownEventListener);
    }

    // Mouse Up Events
    if (this.handleMouseUpEvent && !this._handleMouseUpEventListener)
    {
      $L.debug("Observing for Mouse Up Events", this);
      this._handleMouseUpEventListener = this._handleMouseUpEvent.bindAsEventListener(this);
      this.get("element").observe("mouseup", this._handleMouseUpEventListener);
    }

    // Mouse Move Events
    if (this.handleMouseMoveEvent && !this._handleMouseMoveEventListener)
    {
      $L.debug("Observing for Mouse Move Events", this);
      this._handleMouseMoveEventListener = this._handleMouseMoveEvent.bindAsEventListener(this);
      this.get("element").observe("mousemove", this._handleMouseMoveEventListener);
    }

    // Mouse Over Events
    if (this.handleMouseOverEvent && !this._handleMouseOverEventListener)
    {
      $L.debug("Observing for Mouse Over Events", this);
      this._handleMouseOverEventListener = this._handleMouseOverEvent.bindAsEventListener(this);
      this.get("element").observe("mouseover", this._handleMouseOverEventListener);
    }

    // Mouse Out Events
    if (this.handleMouseOutEvent && !this._handleMouseOutEventListener)
    {
      $L.debug("Observing for Mouse Out Events", this);
      this._handleMouseOutEventListener = this._handleMouseOutEvent.bindAsEventListener(this);
      this.get("element").observe("mouseout", this._handleMouseOutEventListener);
    }

    // Mouse Enter Events
    if (this.handleMouseEnterEvent && !this._handleMouseEnterEventListener)
    {
      $L.debug("Observing for Mouse Enter Events", this);
      this._handleMouseEnterEventListener = this._handleMouseEnterEvent.bindAsEventListener(this);
      this.get("element").observe("mouseenter", this._handleMouseEnterEventListener);
    }

    // Mouse Leave Events
    if (this.handleMouseLeaveEvent && !this._handleMouseLeaveEventListener)
    {
      $L.debug("Observing for Mouse Leave Events", this);
      this._handleMouseLeaveEventListener = this._handleMouseLeaveEvent.bindAsEventListener(this);
      this.get("element").observe("mouseleave", this._handleMouseLeaveEventListener);
    }

    // Handle Touch Start Events
    if (this.handleTouchStartEvent && !this._handleTouchStartEventListener)
    {
      $L.debug("Observing for Touch Start Events", this);
      this._handleTouchStartEventListener = this._handleTouchStartEvent.bindAsEventListener(this);
      this.get("element").observe("touchstart", this._handleTouchStartEventListener);
    }

    // Handle Touch Move Events
    if (this.handleTouchMoveEvent && !this._handleTouchMoveEventListener)
    {
      $L.debug("Observing for Touch Move Events", this);
      this._handleTouchMoveEventListener = this._handleTouchMoveEvent.bindAsEventListener(this);
      this.get("element").observe("touchmove", this._handleTouchMoveEventListener);
    }

    // Handle Touch End Events
    if (this.handleTouchEndEvent && !this._handleTouchEndEventListener)
    {
      $L.debug("Observing for Touch End Events", this);
      this._handleTouchEndEventListener = this._handleTouchEndEvent.bindAsEventListener(this);
      this.get("element").observe("touchend", this._handleTouchEndEventListener);
    }

  },

  _stopObserving: function()
  {

    // Scroll Events
    if (this._handleScrollEventListener)
    {
      this.get("element").stopObserving("scroll", this._handleScrollEventListener);
      this._handleScrollEventListener = false;
    }

    // Focus Events
    if (this._handleFocusEventListener)
    {
      this.get("element").stopObserving("focus", this._handleFocusEventListener);
      this._handleFocusEventListener = false;
    }

    // Blur Events
    if (this._handleBlurEventListener)
    {
      this.get("element").stopObserving("focus", this._handleBlurEventListener);
      this._handleBlurEventListener = false;
    }

    // Click Events
    if (this._handleClickEventListener)
    {
      this.get("element").stopObserving("click", this._handleClickEventListener);
      this._handleClickEventListener = false;
    }

    // Double-Click Events
    if (this._handleDoubleClickEventListener)
    {
      this.get("element").stopObserving("dblclick", this._handleDoubleClickEventListener);
      this._handleDoubleClickEventListener = false;
    }

    // Mouse Down Events
    if (this._handleMouseDownEventListener)
    {
      this.get("element").stopObserving("mousedown", this._handleMouseDownEventListener);
      this._handleMouseDownEventListener = false;
    }

    // Mouse Up Events
    if (this._handleMouseUpEventListener)
    {
      this.get("element").stopObserving("mouseup", this._handleMouseUpEventListener);
      this._handleMouseUpEventListener = false;
    }

    // Mouse Move Events
    if (this._handleMouseMoveEventListener)
    {
      this.get("element").stopObserving("mousemove", this._handleMouseMoveEventListener);
      this._handleMouseMoveEventListener = false;
    }

    // Mouse Over Events
    if (this._handleMouseOverEventListener)
    {
      this.get("element").stopObserving("mouseover", this._handleMouseOverEventListener);
      this._handleMouseOverEventListener = false;
    }

    // Mouse Out Events
    if (this._handleMouseOutEventListener)
    {
      this.get("element").stopObserving("mouseout", this._handleMouseOutEventListener);
      this._handleMouseOutEventListener = false;
    }

    // Mouse Enter Events
    if (this._handleMouseEnterEventListener)
    {
      this.get("element").stopObserving("mouseenter", this._handleMouseEnterEventListener);
      this._handleMouseEnterEventListener = false;
    }

    // Mouse Leave Events
    if (this._handleMouseLeaveEventListener)
    {
      this.get("element").stopObserving("mouseleave", this._handleMouseLeaveEventListener);
      this._handleMouseLeaveEventListener = false;
    }

    // Touch Start Events
    if (this._handleTouchStartEventListener)
    {
      this.get("element").stopObserving("touchstart", this._handleTouchStartEventListener);
      this._handleTouchStartEventListener = false;
    }

    // Touch Move Events
    if (this._handleTouchMoveEventListener)
    {
      this.get("element").stopObserving("touchmove", this._handleTouchMoveEventListener);
      this._handleTouchMoveEventListener = false;
    }

    // Touch End Events
    if (this._handleTouchEndEventListener)
    {
      this.get("element").stopObserving("touchend", this._handleTouchEndEventListener);
      this._handleTouchEndEventListener = false;
    }

  },

  _handleScrollEvent: function(event)
  {
    this._viewDidScroll();
  },

  _handleFocusEvent: function(event)
  {
    if (!this.handleFocusEvent)
    {
      $L.warn("Missing handleFocusEvent callback method!", this);
      return;
    }

    var element = event.element();
    this.handleFocusEvent(event, element);
  },

  _handleBlurEvent: function(event)
  {
    if (!this.handleBlurEvent)
    {
      $L.warn("Missing handleBlurEvent callback method!", this);
      return;
    }

    var element = event.element();
    this.handleBlurEvent(event, element);
  },

  _handleClickEvent: function(event)
  {
    if (!this.handleClickEvent)
    {
      $L.warn("Missing handleClickEvent callback method!", this);
      return;
    }

    var element = event.element();
    this.handleClickEvent(event, element);
  },

  _handleDoubleClickEvent: function(event)
  {
    if (!this.handleDoubleClickEvent)
    {
      $L.warn("Missing handleDoubleClickEvent callback method!", this);
      return;
    }

    var element = event.element();
    this.handleDoubleClickEvent(event, element);
  },

  _handleMouseDownEvent: function(event)
  {
    if (!this.handleMouseDownEvent)
    {
      $L.warn("Missing handleMouseDownEvent callback method!", this);
      return;
    }

    var element = event.element();
    this.handleMouseDownEvent(event, element);
  },

  _handleMouseUpEvent: function(event)
  {
    if (!this.handleMouseUpEvent)
    {
      $L.warn("Missing handleMouseUpEvent callback method!", this);
      return;
    }

    var element = event.element();
    this.handleMouseUpEvent(event, element);
  },

  _handleMouseMoveEvent: function(event)
  {
    if (!this.handleMouseMoveEvent)
    {
      $L.warn("Missing handleMouseMoveEvent callback method!", this);
      return;
    }

    var element = event.element();
    this.handleMouseMoveEvent(event, element);
  },

  _handleMouseOverEvent: function(event)
  {
    if (!this.handleMouseOverEvent)
    {
      $L.warn("Missing handleMouseOverEvent callback method!", this);
      return;
    }

    var element = event.element();
    this.handleMouseOverEvent(event, element);
  },

  _handleMouseOutEvent: function(event)
  {
    if (!this.handleMouseOutEvent)
    {
      $L.warn("Missing handleMouseOutEvent callback method!", this);
      return;
    }

    var element = event.element();
    this.handleMouseOutEvent(event, element);
  },

  _handleMouseEnterEvent: function(event)
  {
    if (!this.handleMouseEnterEvent)
    {
      $L.warn("Missing handleMouseEnterEvent callback method!", this);
      return;
    }

    var element = event.element();
    this.handleMouseEnterEvent(event, element);
  },

  _handleMouseLeaveEvent: function(event)
  {
    if (!this.handleMouseLeaveEvent)
    {
      $L.warn("Missing handleMouseLeaveEvent callback method!", this);
      return;
    }

    var element = event.element();
    this.handleMouseLeaveEvent(event, element);
  },

  _handleTouchStartEvent: function(event)
  {
    if (!this.handleTouchStartEvent)
    {
      $L.warn("Missing handleTouchStartEvent callback method!", this);
      return;
    }

    var element = event.element();
    this.handleTouchStartEvent(event, element);
  },

  _handleTouchMoveEvent: function(event)
  {
    if (!this.handleTouchMoveEvent)
    {
      $L.warn("Missing handleTouchMoveEvent callback method!", this);
      return;
    }

    var element = event.element();
    this.handleTouchMoveEvent(event, element);
  },

  _handleTouchEndEvent: function(event)
  {
    if (!this.handleTouchEndEvent)
    {
      $L.warn("Missing handleTouchEndEvent callback method!", this);
      return;
    }

    var element = event.element();
    this.handleTouchEndEvent(event, element);
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
   */
  _wireActionsToInstance: function()
  {
    if (this.get("element").childElements().length === 0) return;

    var actionElements = this.get("element").select('*[data-action]');
    $L.debug('Found ' + actionElements.length + ' ' + "action".pluralize(actionElements.length) + ' in the view (' + this.displayName + ')...', this);

    actionElements.each(
      function(element)
      {
        var action = element.getData('action');
        if (!Object.isUndefined(this[action]))
        {
          element.observe('click',
            function(event)
            {
              var eventElement = event.element();
              var storedView   = element.retrieve("view");
              if (element.hasClassName("disabled")) return;
              this[action](storedView, eventElement);
            }.bind(this)
          );
        }
        else
          $L.warn('Unable to connect action "' + action + '" to view controller as the controller does not define the requested method', this);
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
   *         this.get("fooLabel.element").update('Bar!');
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

  /*
   * Aphid.UI.View#_viewWillAppear(animated) -> null
   *
   * Calls the viewWillAppear callback on the current view and all of the
   * views subviews.
   */
  _viewWillAppear: function(animated)
  {
    $L.debug("_viewWillAppear (previously called: " + (this._viewWillAppearCalled ? "yes" : "no") + ", animated: " + animated + ")", this);

    // Start Observing for Events
    if (!this._viewWillAppearCalled && this.isEnabled)
      this._startObserving();

    // Call the Callback Method
    if (!this._viewWillAppearCalled && this.viewWillAppear) this.viewWillAppear(animated);
    this.get("subviews").each(function(subview) {
      if (subview._viewWillAppearCalled) return;
      subview._viewWillAppear(animated);
    });

    // Allow View to Layout its Subviews
    if (!this._viewWillAppearCalled)
      this._layoutSubviews();

    this._viewWillAppearCalled = true;
    this._viewWillDisappearCalled = false;
  },

  /*
   * Aphid.UI.View#_viewDidAppear(animated) -> null
   *
   * Calls the viewDidAppear callback on the current view and all of the
   * views subviews.
   */
  _viewDidAppear: function(animated)
  {
    $L.debug("_viewDidAppear (previously called: " + (this._viewDidAppearCalled ? "yes" : "no") + ", animated: " + animated + ")", this);

    // Call the Callback Method
    if (!this._viewDidAppearCalled && this.viewDidAppear) this.viewDidAppear(animated);
    this.get("subviews").each(function(subview) {
      if (subview._viewDidAppearCalled) return;
      subview._viewDidAppear(animated);
    });

    // Allow View to Layout its Subviews
    if (!this._viewDidAppearCalled)
      this._layoutSubviews();

    this._viewDidAppearCalled = true;
    this._viewDidDisappearCalled = false;
  },

  /*
   * Aphid.UI.View#_viewWillDisappear(animated) -> null
   *
   * Calls the viewWillDisappear callback on the current view and all of the
   * views subviews.
   */
  _viewWillDisappear: function(animated)
  {
    $L.debug("_viewWillDisappear (previously called: " + (this._viewWillDisappearCalled ? "yes" : "no") + ", animated: " + animated + ")", this);

    // Stop Observing for Events
    if (!this._viewWillDisappearCalled)
      this._stopObserving();

    // Call the Callback Method
    if (!this._viewWillDisappearCalled && this.viewWillDisappear) this.viewWillDisappear(animated);
    this.get("subviews").each(function(subview) {
      if (subview._viewWillDisappearCalled) return;
      subview._viewWillDisappear(animated);
    });

    this._viewWillDisappearCalled = true;
    this._viewWillAppearCalled = false;
  },

  /*
   * Aphid.UI.View#_viewDidDisappear(animated) -> null
   *
   * Calls the viewDidDisappear callback on the current view and all of the
   * views subviews.
   */
  _viewDidDisappear: function(animated)
  {
    $L.debug("_viewDidDisappear (previously called: " + (this._viewDidDisappearCalled ? "yes" : "no") + ", animated: " + animated + ")", this);

    // Call the Callback Method
    if (!this._viewDidDisappearCalled && this.viewDidDisappear) this.viewDidDisappear(animated);
    this.get("subviews").each(function(subview) {
      if (subview._viewDidDisappearCalled) return;
      subview._viewDidDisappear(animated);
    });

    this._viewDidDisappearCalled = true;
    this._viewDidAppearCalled = false;
  },

  /*
   * Aphid.UI.View#_viewDidScroll() -> null
   *
   * Calls the viewDidScroll callback on the current view, the
   * viewScrollOffsetDidChange delegate method on the view's delegate and
   * raises the ViewDidScrollNotification.
   */
  _viewDidScroll: function()
  {
    $L.debug("_viewDidScroll", this);
    if (this.viewDidScroll)
      this.viewDidScroll();
    if (this.delegate && this.delegate.viewScrollOffsetDidChange)
      this.delegate.viewScrollOffsetDidChange(this);
    this.postNotification("ViewDidScrollNotification");
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
  },

  /*
   * Aphid.UI.View#_layoutSubviews(animated) -> null
   *
   * Calls the layoutSubviews callback on the current view and all of its
   * subviews. This is automatically called when the window resizes or when
   * any view resizes.
   */
  _layoutSubviews: function()
  {
    $L.debug("_layoutSubviews", this);

    if (this.layoutSubviews) this.layoutSubviews();
    this.get("subviews").invoke("_layoutSubviews");
  },

  scopeIdentifier: function()
  {
    return this.displayName + "-" + this.instanceIdentifier;
  }

});

// Transitions ---------------------------------------------------------------

/**
 * Aphid.UI.View.FadeTransition -> 0
 *
 * The fade transition will fade out the view being removed (if present) and
 * fade in the view being added or set.
**/
Aphid.UI.View.FadeTransition = 0;

/**
 * Aphid.UI.View.SlideLeftTransition -> 1
 *
 * The slide left transition will slide the view to be removed out of the
 * viewable area to the left while simultaneously sliding the view to be added
 * in from the right.
**/
Aphid.UI.View.SlideLeftTransition = 1;

/**
* Aphid.UI.View.SlideRightTransition -> 2
*
* The slide right transition will slide the view to be removed out of the
* viewable area to the right while simultaneously sliding the view to be added
* in from the left.
**/
Aphid.UI.View.SlideRightTransition = 2;
