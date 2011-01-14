/**
 * class Aphid.UI.ModalView < Aphid.UI.View
 *
 * Supports the display of modal view controllers.
 *
**/
Aphid.UI.ModalView = Class.create(Aphid.UI.View,
{

  displayName: "Aphid.UI.ModalView",

  /**
   * Aphid.UI.ModalView#viewController -> Aphid.UI.ViewController | false
  **/
  viewController: false,

  // -------------------------------------------------------------------------

  /**
   * new Aphid.UI.ModalView([options])
   *
   * - options (Hash): Initial property values to set on the View Controller instance
   *
   * Initializes a new View Controller.
  **/
  initialize: function($super, options)
  {
    $super(options);
  },

  /*
   * Aphid.UI.ModalView#element() -> Element
   *
   * Creates the element for the ModalView programmatically.
   */
  // element: function()
  // {
  // 
  //   // Container
  //   var element = new Element("section");
  //   element.addClassName("ModalView");
  // 
  //   // Content View
  //   // this.contentView = new View({ element: new Element("section", { id: "contentView" }) });
  //   // element.insert(this.contentView);
  // 
  //   return element;
  // },

  /**
   * Aphid.UI.ModalView#show() -> null
   *
   * Displays the alert view to the user.
  **/
  show: function()
  {
    this.showAnimated(false);
  },

  /**
   * Aphid.UI.ModalView#showAnimated([animated = true]) -> null
   *
   * - animated (Boolean): If true, the alert view will be displayed with an
   *   animated effect.
   *
   * Displays the alert view to the user with an optional animated effect.
  **/
  showAnimated: function(animated)
  {
    if (Object.isUndefined(animated)) animated = true;

    // TODO Add a queue so that subsequent alerts are not lost...
    if (Aphid.UI.ModalView.currentModalView) return;

    // Update View
    this._titleElement.update(this.title || "");
    this._messageElement.update(this.message || "");
    this._statusElement.update(this.status || "");

    var mainWindow = $AppDelegate.mainWindow;
    mainWindow.displayOverlayAnimated(animated);
    mainWindow.addSubviewAnimated(this);
  },

  /**
   * Aphid.UI.ModalView#dismiss() -> null
   *
   * Dismisses the alert view from the window.
  **/
  dismiss: function()
  {
    this.dismissAnimated(false);
  },

  /**
   * Aphid.UI.ModalView#dismissAnimated([animated = true]) -> null
   *
   * - animated (Boolean): If true, the alert view will be displayed with an
   *   animated effect.
   *
   * Dismisses the alert view from the window with an optional animated
   * effect.
  **/
  dismissAnimated: function(animated)
  {
    if (Object.isUndefined(animated)) animated = true;

    var mainWindow = $AppDelegate.mainWindow;
    mainWindow.dismissOverlayAnimated(animated);

    this.removeFromSuperviewAnimated();

    this.title = false;
    this.message = false;
    this.status = false;
  }

});

Aphid.UI.ModalView.currentModalView = false;
