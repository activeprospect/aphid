/**
 * class Aphid.UI.NavigationController < Aphid.UI.ViewController
 *
 * # Callback Methods
 *
 * # Delegate Methods
 *
 * # Notifications
 *
**/
Aphid.UI.NavigationController = Aphid.Class.create("Aphid.UI.NavigationController", Aphid.UI.ViewController,
{

  /**
   * Aphid.UI.NavigationController#contentView -> Aphid.UI.View | false
  **/
  contentView: false,

  /**
   * Aphid.UI.NavigationController#headerView -> Aphid.UI.View | false
  **/
  headerView: false,

  /**
   * Aphid.UI.NavigationController#rootViewController -> Aphid.UI.ViewController
   *
   * The root view controller instance. This is the controller whose view will
   * be displayed when the NavigationController is presented to the user.
  **/
  rootViewController: false,

  /**
   * Aphid.UI.NavigationController#title -> String | false
  **/
  title: false,

  /**
   * Aphid.UI.NavigationController#titleView -> Aphid.UI.View | false
  **/
  titleView: false,

  /**
   * Aphid.UI.NavigationController#viewControllers -> Array
   *
   * An array of view controllers that this view controller instance is
   * managing directly.
  **/
  viewControllers: false,

  /**
   * Aphid.UI.NavigationController#visibleViewController -> Aphid.UI.ViewController
   *
   * The currently visible view controller instance on the navigation stack.
  **/
  visibleViewController: false,

  // Initialization ----------------------------------------------------------

  /**
   * new Aphid.UI.NavigationController([options])
   *
   * - options (Hash): Initial property values to set on the View Controller instance
   *
   * Initializes a new View Controller.
  **/
  initialize: function($super, options)
  {
    if (!this.viewControllers) this.viewControllers = $A([]);

    $super(options);
  },

  viewWillAppear: function()
  {

    // Display the rootViewController by default...
    if (this.get("subviews").length == 0 && this.get("rootViewController"))
      this.pushViewController(this.get("rootViewController"));

  },

  // -------------------------------------------------------------------------

  setRootViewController: function(rootViewController)
  {
    this.rootViewController = rootViewController;
    this.get("viewControllers").push(rootViewController);
    rootViewController.set("navigationController", this);
    return rootViewController;
  },

  getContentView: function()
  {
    if (!this.contentView)
    {
      var contentView = new Aphid.UI.View({ delegate: this });
      contentView.get("element").addClassName("contentView");
      this.contentView = contentView;
      this.addSubview(contentView);
    }
    return this.contentView;
  },

  getHeaderView: function()
  {
    if (!this.headerView)
    {
      this.headerView = new Aphid.UI.View({ delegate: this, tagName: "header" });
      this.addSubview(this.headerView);
    }
    return this.headerView;
  },

  getTitleView: function()
  {
    if (!this.titleView)
    {
      this.titleView = new Aphid.UI.View({ delegate: this, tagName: "h1" });
      this.get("headerView").addSubview(this.titleView);
    }
    return this.titleView;
  },

  setTitle: function(title)
  {
    var oldTitle = this.title;
    this.title = title;

    if (oldTitle && oldTitle != title)
    {
      this.get("titleView").hideAnimated();
      var setNewTitleFunction = function() {
        this.get("titleView.element").update(title);
        this.get("titleView").showAnimated();
      }.bind(this).delay(0.25);
    }
    else
    {
      this.get("titleView.element").update(title);
      this.get("titleView").show();
    }

    return title;
  },

  _previousViewController: function()
  {
    var currentIndex           = this.get("viewControllers").indexOf(this.get("visibleViewController")),
        previousViewController = this.get("viewControllers")[currentIndex - 1];
    return previousViewController;
  },

  // Navigation Stack --------------------------------------------------------

  /**
   * Aphid.UI.NavigationController#pushViewController(viewController) -> null
   *
   *  - viewController ([[Aphid.UI.ViewController]]): The view controller
   *    instance that should be pushed onto the navigation stack.
   *
  **/
  pushViewController: function(viewController)
  {
    this._pushViewController(viewController, false);
  },

  /**
   * Aphid.UI.NavigationController#pushViewControllerAnimated(viewController[, transition = Aphid.UI.View.SlideLeftTransition]) -> null
   *
   *  - viewController ([[Aphid.UI.ViewController]]): The view controller
   *    instance that should be pushed onto the view stack.
   *
   *  - transition (Number): The animation transition to be used when pushing
   *    the view controller instance onto the view stack. Defaults to
   *    [[Aphid.UI.View.SlideLeftTransition]].
   *
  **/
  pushViewControllerAnimated: function(viewController, transition)
  {
    this._pushViewController(viewController, true, transition);
  },

  /*
   * Aphid.UI.NavigationController#_pushViewController(viewController, animated, transition) -> null
   */
  _pushViewController: function(viewController, animated, transition)
  {
    if (Object.isUndefined(transition)) transition = Aphid.UI.View.SlideLeftTransition;

    // Set this navigationController on the pushed view controller instance
    viewController.set("navigationController", this);

    // Set the modalView on the pushed view controller instance
    viewController.set("modalView", this.get("modalView"));
    viewController.set("parentViewController", this);

    // Set the visibleViewController to the pushed view controller
    this.set("visibleViewController", viewController);

    // Add the view controller to the viewControllers stack
    this.get("viewControllers").push(viewController);

    // Present the pushed view controller
    if (animated)
      this.get("contentView").setViewAnimated(viewController, true, transition);
    else
      this.get("contentView").setView(viewController);
  },

  /**
   * Aphid.UI.NavigationController#popViewController() -> Aphid.UI.ViewController | false
  **/
  popViewController: function()
  {
    return this._popViewController(false);
  },

  /**
   * Aphid.UI.NavigationController#popViewControllerAnimated([transition = Aphid.UI.View.SlideRightTransition]) -> Aphid.UI.ViewController | false
   *
   *  - transition (Number): The animation transition to be used when popping
   *    the view controller instance off of the view stack.
   *
  **/
  popViewControllerAnimated: function(transition)
  {
    return this._popViewController(true, transition);
  },

  /*
   * Aphid.UI.NavigationController#_popViewController([animated = true[, transition = Aphid.UI.View.SlideRightTransition]]) -> Aphid.UI.ViewController | false
   */
  _popViewController: function(animated, transition)
  {
    if (Object.isUndefined(animated)) animated = true;
    if (Object.isUndefined(transition)) transition = Aphid.UI.View.SlideRightTransition;

    // Don't allow the root view controller to be popped off the stack
    if (this.get("viewControllers").length == 1)
    {
      $L.warn("Cannot pop the root view controller!", this);
      return false;
    }

    // Pop the view controller of the stack
    var poppedViewController = this.get("viewControllers").pop(),
        viewController       = this.get("viewControllers").last();

    // Set the visibleViewController to the popped view controller
    this.set("visibleViewController", viewController);

    // Present the previous view controller
    if (animated)
      this.get("contentView").setViewAnimated(viewController, true, transition);
    else
      this.get("contentView").setView(viewController);

  }

});
