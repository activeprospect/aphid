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
Aphid.UI.ViewController = Class.create(Aphid.UI.View,
{

  displayName: "Aphid.UI.ViewController",

  /*
   * Aphid.UI.ViewController#_modalViewContainer -> Element | false
   *
   * The container element that will contain the modal view controller's view.
  **/
  _modalViewContainer: false,

  /**
   * Aphid.UI.ViewController#modalViewController -> ViewController | false
   *
   * The currently presented modal view controller whose parent is this view
   * controller, or false if no view controller is currently modal.
  **/
  modalViewController: false,

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
  **/
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
    var mainWindow = Application.sharedInstance.mainWindow;
    mainWindow.displayOverlayAnimated(animated);

    // Display the Modal View Container
    if (!this._modalViewContainer)
    {
      this._modalViewContainer = new Element("div", { className: 'modalView' });
      this._modalViewContainer.hide();
      document.body.insert(this._modalViewContainer);
    }
    animated ? this._modalViewContainer.appear({ duration: 0.5 }).morph({ top: "10%", bottom: "10%" }, { duration: 0.25 }) : this._modalViewContainer.show();

    // Setup the View
    viewController.element.hide();
    viewController.superview = this;

    this.modalViewController = viewController;
    // TODO This should be parentViewController
    this.subviews.push(this.modalViewController);

    // "View Will Appear..."
    if (this.modalViewController.viewWillAppear)
      this.modalViewController.viewWillAppear();

    // Insert the view into the DOM
    this._modalViewContainer.insert(this.modalViewController.element);

    // Display the View
    animated ? this.modalViewController.element.appear({ duration: 0.25 }) : this.modalViewController.element.show();

    // "View Did Appear..."
    if (this.modalViewController.viewDidAppear)
      this.modalViewController.viewDidAppear();
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
    if (!this.modalViewController) return;

    // Hide the Overlay
    var mainWindow = Application.sharedInstance.mainWindow;
    mainWindow.dismissOverlayAnimated(animated);

    // Hide the Modal View Container
    animated ? this._modalViewContainer.fade({ duration: 0.25 }) : this._modalViewContainer.hide();
    animated ? this._modalViewContainer.update.delay(0.25) : this._modalViewContainer.update();

    // Unset the Modal View Controller
    this.modalViewController = false;
  }

});
