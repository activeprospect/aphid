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

  /**
   * Aphid.UI.ViewController#modalView -> Aphid.UI.ModalView | false
   *
   * The [[Aphid.UI.ModalView]] instance that will contain the current modal
   * view controller.
  **/
  modalView: false,

  /**
   * Aphid.UI.ViewController#modalViewController -> Aphid.UI.ViewController | false
   *
   * The currently presented modal view controller whose parent is this view
   * controller, or false if no view controller is currently modal.
  **/
  modalViewController: false,

  /**
   * Aphid.UI.ViewController#parentViewController -> Aphid.UI.ViewController | false
   *
   * The view controller instance that this view controller belongs to and is
   * being managed by. This will be false if the view controller is not being
   * managed by another view controller.
  **/
  parentViewController: false,

  /**
   * Aphid.UI.ViewController#navigationController -> Aphid.UI.NavigationController | false
  **/
  navigationController: false,

  // Initialization ----------------------------------------------------------

  /**
   * new Aphid.UI.ViewController([options])
   *
   * - options (Hash): Initial property values to set on the View Controller instance
   *
   * Initializes a new View Controller instance with the given *options*.
  **/
  initialize: function($super, options)
  {
    $super(options);
  },

  // Accessors ---------------------------------------------------------------

  /*
   * Aphid.UI.ViewController#getModalView() -> Aphid.UI.ModalView
   *
   * Returns the [[Aphid.UI.ModalView]] instance that will contain the
   * presented modal view controller. This accessor will lazily initialize the
   * instance, if necessary.
   */
  getModalView: function()
  {
    if (!this.modalView)
      this.modalView = new Aphid.UI.ModalView({
        viewController: this,
        delegate: this
      });
    return this.modalView;
  },

  // Modal View Controllers --------------------------------------------------

  /**
   * Aphid.UI.ViewController#presentModalViewController(viewController) -> null
   *
   *  - viewController ([[Aphid.UI.ViewController]]): The view controller that
   *    should be presented
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
   *  - viewController ([[Aphid.UI.ViewController]]): The view controller that
   *    should be presented.
   *
   *  - animated (Boolean): true if the view controller should be presented
   *    with animation.
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
   *  - viewController ([[Aphid.UI.ViewController]]): The view controller that
   *    should be presented.
   *
   *  - animated (Boolean): true if the view controller should be presented
   *    with animation
   *
   * Presents the specified *viewController* as the modal view of the current
   * view controller, presenting it optionally with an animated effect.
   */
  _presentModalViewController: function(viewController, animated)
  {
    if (Object.isUndefined(animated)) animated = false;

    // If the view has still not been loaded, delay this call again...
    if (!viewController.get("isLoaded"))
    {
      // TODO We need to add a counter to this so that we don't wait longer
      // a few seconds before giving up and raising a warning...
      this._presentModalViewController.bind(this).delay(0.1, viewController, animated);
      return;
    }

    $L.info('Adding "' + viewController.displayName + '" as a subview to "' + (this.displayName || "unknown") + '" (animated: ' + animated + ')', this);

    // Display the Overlay
    $AppDelegate.get("mainWindow").displayOverlayAnimated(animated);

    // Add the Modal View Controller to the Modal View
    this.get("modalView").setView(viewController);

    // Display the Modal View in the Main Window
    if (animated)
      $AppDelegate.get("mainWindow").addSubviewAnimated(this.get("modalView"));
    else
      $AppDelegate.get("mainWindow").addSubview(this.get("modalView"));

    // Set the current Modal View Controller to the presented instance
    this.set("modalViewController", viewController);

    // Set the Parent View Controller to this instance
    viewController.set("parentViewController", this);
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
   *  - animated (Boolean): true if the view controller should be dismissed
   *    with animation
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
  }

});
