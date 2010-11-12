/**
 * class Aphid.UI.AlertView < Aphid.UI.View
 *
 * Supports the display of modal alert messages, such as notice of errors or
 * warnings or informational prompts.
 *
 * #### Example
 *
 *     var alertView = new Aphid.UI.AlertView({
 *       title: "Error Loading Resource",
 *       message: "An error occurred while attempting to load the resource.",
 *       status: "Error 404 - Not Found"
 *     });
 *     alertView.showAnimated();
 *
**/
Aphid.UI.AlertView = Class.create(Aphid.UI.View,
{

  /**
   * Aphid.UI.AlertView#title -> String | false
   *
   * The title that should be displayed in the alert dialog.
  **/
  title: false,

  /*
   * Aphid.UI.AlertView#_titleElement -> Element | false
   *
   * A reference to the element that will display the title string in the
   * alert dialog markup.
  **/
  _titleElement: false,

  /**
   * Aphid.UI.AlertView#message -> String | false
   *
   * The message that should be displayed in the alert dialog.
  **/
  message: false,

  /*
   * Aphid.UI.AlertView#_messageElement -> Element | false
   *
   * A reference to the element that will display the message string in the
   * alert dialog markup.
   */
  _messageElement: false,

  /**
   * Aphid.UI.AlertView#status -> String | false
   *
   * The status message, such as an error code, that should be displayed in
   * the alert dialog.
  **/
  status: false,

  /*
   * Aphid.UI.AlertView#_statusElement -> Element | false
   *
   * A reference to the element that will display the status message string in
   * the alert dialog markup.
   */
  _statusElement: false,

  // -------------------------------------------------------------------------

  /**
   * new Aphid.UI.AlertView([options])
   *
   * - options (Hash): Initial property values to set on the View Controller instance
   *
   * Initializes a new View Controller.
  **/
  initialize: function($super, options)
  {
    options = $H(options);
    options.set("element", this._element());
    $super(options);
  },

  /*
   * Aphid.UI.AlertView#_element() -> Element
   *
   * Creates the element for the AlertView programmatically.
   */
  // TODO Programatically declaring a Views element should be a supported feature
  _element: function()
  {

    // Container
    var element = new Element("section");
    element.addClassName("AlertView");

    // Header
    var headerElement  = new Element("header");
    this._titleElement = new Element("h1");
    headerElement.insert(this._titleElement);
    element.insert(headerElement);

    // Message Area
    var sectionElement   = new Element("section", { id: "alertMessageSection" });
    this._messageElement = new Element("p").addClassName("message");
    sectionElement.insert(this._messageElement);
    element.insert(sectionElement);

    // Footer
    var footerElement   = new Element("footer");
    this._statusElement = new Element("p").addClassName("status");
    var closeButton     = new Element("input", { type: "button", value: "Dismiss" });
    footerElement.insert(this._statusElement);
    footerElement.insert(closeButton);
    closeButton.observe("click", this.dismissAnimated.bind(this));
    element.insert(footerElement);

    return element;
  },

  /**
   * Aphid.UI.AlertView#show() -> null
   *
   * Displays the alert view to the user.
  **/
  show: function()
  {
    this.showAnimated(false);
  },

  /**
   * Aphid.UI.AlertView#showAnimated([animated = true]) -> null
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
    if (Aphid.UI.AlertView.currentAlertView) return;

    // Update View
    this._titleElement.update(this.title || "");
    this._messageElement.update(this.message || "");
    this._statusElement.update(this.status || "");

    var mainWindow = $AppDelegate.mainWindow;
    mainWindow.displayOverlayAnimated(animated);
    mainWindow.addSubviewAnimated(this);
  },

  /**
   * Aphid.UI.AlertView#dismiss() -> null
   *
   * Dismisses the alert view from the window.
  **/
  dismiss: function()
  {
    this.dismissAnimated(false);
  },

  /**
   * Aphid.UI.AlertView#dismissAnimated([animated = true]) -> null
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

Aphid.UI.AlertView.currentAlertView = false;
