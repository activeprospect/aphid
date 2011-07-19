/**
 * class Aphid.UI.ModalView < Aphid.UI.View
 *
 * A view, typically owned by an instance of [[Aphid.UI.ViewController]],
 * that is responsible for the display of a view controller instance in a
 * modal fashion. The [[Aphid.UI.ViewController]] is responsible for the
 * presentation and dismissal of the modal view instance, but the modal view
 * instance can act as a proxy to the owning view controller instance by the
 * views that are being presented modally.
 *
 * You should rarely, if ever, have a need to instantiate instances of this
 * class directly. Instead, use the [[Aphid.UI.ViewController#presentModalViewController]]
 * method to instantiate a new modal view and display a view controller as
 * modal.
 *
 * It is important to note that although instances of [[Aphid.UI.ModalView]]
 * are instantiated and presented by instances of [[Aphid.UI.ViewController]],
 * the modal view is actually a subview of the shared [[Aphid.UI.Window]]
 * instance when presented by the view controller.
 *
**/
Aphid.UI.ModalView = Aphid.Class.create("Aphid.UI.ModalView", Aphid.UI.View, {

  /**
   * Aphid.UI.ModalView#viewController -> Aphid.UI.ViewController | false
   *
   * The view controller that is being presented modally in this modal view.
  **/
  viewController: false,

  /**
   * Aphid.UI.ModalView#parentViewController -> Aphid.UI.ViewController | false
   *
   * The instance of [[Aphid.UI.ViewController]] that the modal view instance
   * belongs to. This would be the view controller is responsible for the
   * modal view as the result of a call to [[Aphid.UI.ViewController#presentModalViewController]].
  **/
  parentViewController: false,

  /**
   * Aphid.UI.ModalView#dismissOnEscape -> Boolean
   *
   * Configures whether or not the modal view will dismiss when the user
   * presses the escape key. Defaults to `true`.
  **/
  dismissOnEscape: false,

  // Initialization ----------------------------------------------------------

  initialize: function($super, options)
  {
    this.dismissOnEscape = true;

    $super(options);
  },

  // -------------------------------------------------------------------------

  setViewController: function(viewController)
  {
    this.viewController = viewController;
    this.setView(viewController);
    return viewController;
  },

  // -------------------------------------------------------------------------

  /**
   * Aphid.UI.ModalView#dismiss() -> null
   *
   * Dismisses the modal view by calling the dismissModalViewController method
   * on the delegate view controller of this modal view instance.
  **/
  dismiss: function()
  {
    this.callDelegateMethod("dismissModalViewController");
  },

  /**
   * Aphid.UI.ModalView#dismissAnimated([animated = true]) -> null
   *
   * - animated (Boolean): If true, the modal view will be dismissed with an
   *   animated effect.
   *
   * Dismisses the modal view by calling the
   * dismissModalViewControllerAnimated method on the delegate view controller
   * of this modal view instance.
  **/
  dismissAnimated: function(animated)
  {
    if (Object.isUndefined(animated)) animated = true;
    this.callDelegateMethod("dismissModalViewControllerAnimated", animated);
  },

  // Event Handlers ----------------------------------------------------------

  _startObserving: function($super)
  {
    $super();

    // Observe for "Key Down" Events
    if (this.get("dismissOnEscape") && !this._handleKeyDownEventListener)
    {
      this._handleKeyDownEventListener = this.handleKeyDownEvent.bindAsEventListener(this);
      document.observe("keydown", this._handleKeyDownEventListener);
    }
  },

  _stopObserving: function($super)
  {
    $super();

    // Stop Observing for "Key Down" Events
    if (this._handleKeyDownEventListener)
    {
      document.stopObserving("keydown", this._handleKeyDownEventListener);
      this._handleKeyDownEventListener = false;
    }
  },

  handleKeyDownEvent: function(event)
  {
    if (this.get("dismissOnEscape") && event.keyCode == 27)
      this.dismissAnimated();
  }

});
