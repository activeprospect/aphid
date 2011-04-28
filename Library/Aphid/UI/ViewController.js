/**
 * class Aphid.UI.ViewController < Aphid.UI.View
 *
 * You should use view controllers for major views that are responsible for
 * many subviews (including view controller subviews). Situations where a
 * view controller may be desirable over a view would be the main interfaces
 * of a web application.
 *
 * View controllers are typically long-lived and include additional callbacks
 * and delegates that notify the class of view state changes, such as
 * notifying that the view will be displayed or hidden, etc.
 *
**/
Aphid.UI.ViewController = Aphid.Class.create("Aphid.UI.ViewController", Aphid.UI.View,
{

  /*
   * Aphid.UI.ViewController#_modalViewContainer -> Element | false
   *
   * The container element that will contain the modal view controller's view.
   */
  _modalViewContainer: false,

  /**
   * Aphid.UI.ViewController#modalViewController -> Aphid.UI.ViewController | false
   *
   * The currently presented modal view controller whose parent is this view
   * controller, or false if no view controller is currently modal.
  **/
  modalViewController: false,

  /**
   * Aphid.UI.ViewController#modalView -> Aphid.UI.ModalView
   *
   * The currently presented modal view controller whose parent is this view
   * controller, or false if no view controller is currently modal.
  **/
  modalView: function()
  {
    if (!this._modalView)
      this._modalView = new Aphid.UI.ModalView({
        viewController: this,
        delegate: this
      });
    return this._modalView;
  },

  /**
   * Aphid.UI.ViewController#viewControllers -> Array | false
  **/
  viewControllers: false,

  /**
   * Aphid.UI.ViewController#parentViewController -> Aphid.UI.ViewController | false
  **/
  parentViewController: false,

  // -------------------------------------------------------------------------

  /**
   * new Aphid.UI.ViewController([options])
   *
   * - options (Hash): Initial property values to set on the View Controller instance
   *
   * Initializes a new View Controller.
  **/
  initialize: function($super, options)
  {
    $super(options);
  },

  // Modal View Controllers --------------------------------------------------

  /**
   * Aphid.UI.ViewController#presentModalViewController(viewController) -> null
   *
   * - viewController (ViewController): the view controller that should be presented
   *
   * Presents the specified *viewController* as the modal view of the current
   * view controller.
  **/
  presentModalViewController: function(viewController)
  {
    $L.info("presentModalViewController", this);
    this.presentModalViewControllerAnimated(viewController, false);
  },

  /**
   * Aphid.UI.ViewController#presentModalViewControllerAnimated(viewController[, animated = true]) -> null
   *
   * - viewController (ViewController): the view controller that should be presented
   * - animated (Boolean): true if the view controller should be presented with animation
   *
   * Presents the specified *viewController* as the modal view of the current
   * view controller with an animated effect, by default.
  **/
  presentModalViewControllerAnimated: function(viewController, animated)
  {
    if (Object.isUndefined(animated)) animated = true;

    // If the view is loading, we need to wait for it to finish loading before
    // we can present it.
    if (viewController.isLoading)
      this._presentModalViewController.bind(this).delay(0.1, viewController, animated);

    // Otherwise, we can present it immediately.
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
   */
  _presentModalViewController: function(viewController, animated)
  {
    if (Object.isUndefined(animated)) animated = false;

    // If the view has still not been loaded, delay this call again...
    if (!viewController.isLoaded)
    {
      // TODO We need to add a counter to this so that we don't wait longer
      // a few seconds before giving up and raising a warning...
      this._presentModalViewController.bind(this).delay(0.1, viewController, animated);
      return;
    }

    $L.info('Adding "' + viewController.displayName + '" as a subview to "' + (this.displayName || "unknown") + '" (animated: ' + animated + ')', this);

    // Display the Overlay
    $AppDelegate.mainWindow.displayOverlayAnimated(animated);

    // Add the Modal View Controller to the Modal View
    this.get("modalView").setView(viewController);

    // Display the Modal View
    if (animated)
      $AppDelegate.mainWindow.addSubviewAnimated(this.get("modalView"));
    else
      $AppDelegate.mainWindow.addSubview(this.get("modalView"));

    this.set("modalViewController", viewController);
    // TODO This should be parentViewController
    // this.subviews.push(this.modalViewController);
  },

  /**
   * Aphid.UI.View#dismissModalViewController() -> null
   *
   * Dismisses the current modal view controller, if present.
  **/
  // TODO if this is called on the modal view controller itself, it should be forwarded to its parent view controller
  dismissModalViewController: function()
  {
    this.dismissModalViewControllerAnimated(false);
  },

  /**
   * Aphid.UI.View#dismissModalViewController([animated = true]) -> null
   *
   * - animated (Boolean): true if the view controller should be dismissed with animation
   *
   * Dismisses the current modal view controller, if present, with animation
   * by default.
  **/
  dismissModalViewControllerAnimated: function(animated)
  {
    if (Object.isUndefined(animated)) animated = true;
    if (!this.get("modalViewController")) return;

    // Hide the Overlay
    $AppDelegate.get("mainWindow").dismissOverlayAnimated(animated);

    // Hide the Modal View Container
    if (animated)
    {
      this.get("modalView").removeFromSuperviewAnimated();
      this.get("modalViewController").removeFromSuperviewAnimated();
    }
    else
    {
      this.get("modalView").removeFromSuperview();
      this.get("modalViewController").removeFromSuperview();
    }

    // Unset the Modal View Controller
    this.set("modalViewController", false);
  },

  // Stacked View Controllers ------------------------------------------------

  /**
   * Aphid.UI.ViewController#pushViewController(viewController) -> null
  **/
  pushViewController: function(viewController)
  {
    this._pushViewController(viewController, false);
  },

  /**
   * Aphid.UI.ViewController#pushViewControllerAnimated(viewController, transition) -> null
  **/
  pushViewControllerAnimated: function(viewController, transition)
  {
    if (Object.isUndefined(transition))
      transition = Aphid.UI.View.SlideLeftTransition;

    this._pushViewController(viewController, true, transition);
  },

  /*
   * Aphid.UI.ViewController#_pushViewController(viewController, animated, transition) -> null
   */
  _pushViewController: function(viewController, animated, transition)
  {
    viewController.set("parentViewController", this);
    if (animated)
      this.get("superview").setViewAnimated(viewController, true, transition);
    else
      this.get("superview").setView(viewController);
  },

  /**
   * Aphid.UI.ViewController#popViewController() -> null
  **/
  popViewController: function()
  {
    var parentViewController = this.get("parentViewController");

    this._popViewController(parentViewController, false);
  },

  /**
   * Aphid.UI.ViewController#popViewControllerAnimated(transition) -> null
  **/
  popViewControllerAnimated: function(transition)
  {
    if (Object.isUndefined(transition))
      transition = Aphid.UI.View.SlideRightTransition;

    var parentViewController = this.get("parentViewController");

    this._popViewController(parentViewController, true, transition);
  },

  /**
   * Aphid.UI.ViewController#_popViewController(viewController, animated, transitoin) -> null
  **/
  _popViewController: function(viewController, animated, transition)
  {
    if (animated)
      this.get("superview").setViewAnimated(viewController, true, transition);
    else
      this.get("superview").setView(viewController);
  }

});
