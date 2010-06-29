//
// View Class & Base View Object
//
// All Views should extend this class.
//

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

  //
  // Clears all subviews of the current view and sets the specified view as
  // the current view's only subview.
  //
  setView: function(view, animated)
  {
    // Remove existing views
    this.subviews.invoke('removeFromSuperview', animated);

    // Clear the Subviews
    this.subviews = $A();

    // Add the specified view as the view's only subview
    this.addSubview(view, animated);

    // if (animated)
    // {
    //   if (this.subviews.length > 0)
    //   {
    //     var currentView = this.subviews.first();
    //     currentView.element.fade({ duration: 0.25 });
    //   }
    // }
  },
  
  addSubview: function(view, animated)
  {
    $L.info('Adding subview...', 'Aphid.UI.View');

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
  
  removeFromSuperview: function(animated)
  {
    // "View Will Disappear"
    if (this.viewWillDisappear)
      this.viewWillDisappear();

    // Hide the View
    animated ? this.element.fade({ duration: 0.25 }) : this.element.hide();

    // Remove the View's element from the DOM
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
              this.element = new Element("section", { className: 'view' }).update(transport.responseText);
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

  // -------------------------------------------------------------------------

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
              eval('this.' + action + '()')
            }.bind(this)
          )

          // var instance = eval("new " + viewClass + "()");
          // instance.initializeFromTemplate(element);
          // this[outlet] = instance;
        }
        else
          $L.warn('Unable to connect action "' + action + '" to view controller as the controller does not define the requested method', 'Aphid.UI.View');
      }.bind(this)
    );
  }


});

// Method Mappings

Aphid.UI.View.prototype._loadViewFromTemplate.displayName = "Aphid.UI.View._loadViewFromTemplate";
