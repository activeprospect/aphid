/**
 * class Aphid.UI.ViewController
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

  /*
   * Aphid.UI.ViewController#_modalViewOverlay -> Element | false
   *
   * The semi-translucent overlay element that is displayed behind modal views.
  **/
  // TODO This should be moved to Window (i.e. Window.presentOverlay or something)
  _modalViewOverlay: false,

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
   * new Aphid.UI.ViewController(delegate)
   *
   * Initializes a new Modal View Controller with the specified delegate.
  **/
  initialize: function($super, delegate)
  {
    $super(delegate);
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
    $L.info("presentModalViewController", "Aphid.UI.ViewController");
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

    $L.info('Adding "' + viewController.viewName + '" as a subview to "' + (this.viewName || "unknown") + '" (animated: ' + animated + ')', 'Aphid.UI.ViewController');

    // Display the Modal View Overlay
    if (!this._modalViewOverlay)
    {
      this._modalViewOverlay = new Element("div", { className: 'modalViewOverlay' });
      this._modalViewOverlay.hide();
      Element.insert(document.body, { top: this._modalViewOverlay });
    }
    animated ? this._modalViewOverlay.appear({ duration: 0.25 }) : this._modalViewOverlay.show();

    // Display the Modal View Container
    if (!this._modalViewContainer)
    {
      this._modalViewContainer = new Element("div", { className: 'modalView' });
      this._modalViewContainer.hide();
      document.body.insert(this._modalViewContainer);
    }
    this._modalViewContainer.appear({ duration: 0.5 }).morph({ top: "10%", bottom: "10%" }, { duration: 0.25 })

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

    animated ? this._modalViewContainer.fade({ duration: 0.25 }) : this._modalViewContainer.hide();
    animated ? this._modalViewOverlay.fade({ duration: 0.25 }) : this._modalViewOverlay.hide();
    this._modalViewContainer.update();
  }

});
