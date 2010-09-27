/**
 * class Aphid.UI.Window < Aphid.UI.View
 *
 * The root view class for the application. All views in the application are
 * at some point in the view heirarchy children of this view.
 *
 * This element property for the Window is the document's BODY element.
**/
Aphid.UI.Window = Class.create(Aphid.UI.View, {

  displayName: "Aphid.UI.Window",

  /*
   * Aphid.UI.Window#_overlayElement -> Element | false
   *
   * The semi-translucent overlay element that is displayed behind modal
   * views, alert and message dialogs.
  **/
  _overlayElement: false,

  /**
   * new Aphid.UI.Window([options])
   *
   * - options (Hash): Initial property values to be set on the Window instance
   *
   * Initializes a new Window instance.
  **/
  initialize: function($super, options)
  {
    options = $H(options);
    options.set("element", document.body);
    options.set("outlet", false);
    options.set("template", false);

    $super(options);
  },

  /**
   * Aphid.UI.Window#displayOverlay() -> null
   *
   * Displays a semi-translucent overlay over the entire window. The style,
   * including the `z-index` that the overlay appears at, are defined by the
   * CSS "overlay" class in the `Window.less` file.
  **/
  displayOverlay: function()
  {
    this.displayOverlayAnimated(false);
  },

  /**
   * Aphid.UI.Window#displayOverlayAnimated([animated = true]) -> null
   *
   * Displays a semi-translucent overlay over the entire window, optionally
   * presenting it with an animated effect. The style, including the `z-index`
   * that the overlay appears at, are defined by the CSS "overlay" class in
   * the `Window.less` file.
  **/
  displayOverlayAnimated: function(animated)
  {
    if (Object.isUndefined(animated)) animated = true;
    // Display the Overlay
    if (!this._overlayElement)
    {
      this._overlayElement = new Element("div", { className: 'overlay' });
      this._overlayElement.hide();
      Element.insert(document.body, { top: this._overlayElement });
    }
    animated ? this._overlayElement.appear({ duration: 0.25, to: 0.6 }) : this._overlayElement.show();
  },

  /** related to: Aphid.UI.Window#dismissOverlayAnimated
   * Aphid.UI.Window#dismissOverlay() -> null
   *
   * Dismisses the overlay that was displayed from a call to
   * [[Aphid.UI.Window#displayOverlay]] or [[Aphid.UI.Window#displayOverlayAnimated]].
  **/
  dismissOverlay: function()
  {
    this.dismissOverlayAnimated(false);
  },

  /** related to: Aphid.UI.Window#dismissOverlay
   * Aphid.UI.Window#dismissOverlayAnimated([animated = true]) -> null
   *
   * Dismisses the overlay that was displayed from a call to
   * [[Aphid.UI.Window#displayOverlay]] or [[Aphid.UI.Window#displayOverlayAnimated]],
   * optionally with an animated effect.
  **/
  dismissOverlayAnimated: function(animated)
  {
    if (Object.isUndefined(animated)) animated = true;
    animated ? this._overlayElement.fade({ duration: 0.25 }) : this._overlayElement.hide();
  }

});
