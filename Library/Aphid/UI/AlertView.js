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
Aphid.UI.AlertView = Aphid.Class.create("Aphid.UI.AlertView", Aphid.UI.View, {

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
   * - options (Hash): Initial property values to set on the AlertView instance
   *
   * Initializes a new AlertView instance.
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
  initialize: function($super, options)
  {
    this._titleElement   = new Element("h1");
    this._messageElement = new Element("p").addClassName("message");
    this._statusElement  = new Element("p").addClassName("status");

    $super(options);
  },

  /*
   * Aphid.UI.AlertView#element() -> Element
   *
   * Creates the element for the AlertView programmatically.
   */
  element: function()
  {

    if (this._element)
      return this._element;

    // Container
    this._element = new Element("section");
    this._element.addClassName("AlertView");

    // Header
    var headerElement  = new Element("header");
    headerElement.insert(this._titleElement);
    this._element.insert(headerElement);

    // Message Area
    var sectionElement   = new Element("section", { id: "alertMessageSection" });
    sectionElement.insert(this._messageElement);
    this._element.insert(sectionElement);

    // Footer
    var footerElement   = new Element("footer");
    var closeButton     = new Element("input", { type: "button", value: "Dismiss" });
    footerElement.insert(this._statusElement);
    footerElement.insert(closeButton);
    closeButton.observe("click", this.dismissAnimated.bind(this));
    this._element.insert(footerElement);

    return this._element;
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

    // Set as "Current Alert View"
    Aphid.UI.AlertView.currentAlertView = this;

    var mainWindow = $AppDelegate.mainWindow;
    mainWindow.displayOverlayAnimated(animated);
    mainWindow.addSubviewAnimated(this, animated);
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

    // Unset "Current Alert View"
    Aphid.UI.AlertView.currentAlertView = false;

    var mainWindow = $AppDelegate.mainWindow;
    mainWindow.dismissOverlayAnimated(animated);

    this.removeFromSuperviewAnimated(animated);

    this.set("title", false);
    this.set("message", false);
    this.set("status", false);
  },

  // Property Setters --------------------------------------------------------

  setTitle: function(title)
  {
    this.title = title;
    this._titleElement.update(title || "");
  },

  setMessage: function(message)
  {
    this.message = message;
    this._messageElement.update(message || "");
  },

  setStatus: function(status)
  {
    this.status = status;
    this._statusElement.update(status || "");
  }

});

Aphid.UI.AlertView.currentAlertView = false;
