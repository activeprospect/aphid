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
    $super(options);

    if (!this.viewControllers) this.viewControllers = $A([]);
  },

  viewWillAppear: function()
  {
    this.get("contentView").addSubview(this.get("rootViewController"));
  },

  // -------------------------------------------------------------------------

  setRootViewController: function(rootViewController)
  {
    this.rootViewController = rootViewController;
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
    if (Object.isUndefined(transition))
      transition = Aphid.UI.View.SlideLeftTransition;

    this._pushViewController(viewController, true, transition);
  },

  /*
   * Aphid.UI.NavigationController#_pushViewController(viewController, animated, transition) -> null
   */
  _pushViewController: function(viewController, animated, transition)
  {
    viewController.set("navigationController", this);
    if (animated)
      this.get("contentView").setViewAnimated(viewController, true, transition);
    else
      this.get("contentView").setView(viewController);
  },

  /**
   * Aphid.UI.NavigationController#popViewController() -> null
  **/
  popViewController: function()
  {
    // var parentViewController = this.get("parentViewController");
    // 
    // this._popViewController(parentViewController, false);
    alert("Not implemented...");
  },
 
  /**
   * Aphid.UI.NavigationController#popViewControllerAnimated(transition) -> null
   *
   *  - transition (Number): The animation transition to be used when popping
   *    the view controller instance off of the view stack.
   *
  **/
  popViewControllerAnimated: function(transition)
  {
    // if (Object.isUndefined(transition))
    //   transition = Aphid.UI.View.SlideRightTransition;
    // 
    // var parentViewController = this.get("parentViewController");
    // 
    // this._popViewController(parentViewController, true, transition);
    alert("Not implemented...");
  },

  /*
   * Aphid.UI.NavigationController#_popViewController(viewController[, animated = true[, transition]]) -> null
   */
  _popViewController: function(viewController, animated, transition)
  {
    if (animated)
      this.get("contentView").setViewAnimated(viewController, true, transition);
    else
      this.get("contentView").setView(viewController);
  }

});
