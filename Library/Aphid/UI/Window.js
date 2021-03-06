/**
 * class Aphid.UI.Window < Aphid.UI.View
 *
 * The root view class for the application. All views in the application are
 * at some point in the view heirarchy children of this view.
 *
 * This element property for the Window is the document's BODY element.
 *
 * **Note:** There should only ever be a single instance of [[Aphid.UI.Window]]
 * in your application. The default application delegate implementation will
 * automatically initialize a shared instance of [[Aphid.UI.Window]] as
 * [[Aphid.Core.Application#mainWindow]].
**/
Aphid.UI.Window = Aphid.Class.create("Aphid.UI.Window", Aphid.UI.View, {

  /**
   * Aphid.UI.Window#overlayElement -> Element | false
   *
   * The semi-translucent overlay element that is displayed behind modal
   * views, alert and message dialogs.
  **/
  overlayElement: false,

  /**
   * Aphid.UI.Window#loadingIndicatorView -> Aphid.UI.LoadingIndicatorView | false
  **/
  loadingIndicatorView: false,

  /**
   * Aphid.UI.Window#confirmBeforeLeaving -> Boolean
   *
   * If true, the user will be prompted to confirm before being allowed to
   * leave the application (i.e. go to a different URL, close the browser
   * window, etc).
  **/
  confirmBeforeLeaving: false,

  // -------------------------------------------------------------------------

  /*
   * new Aphid.UI.Window([options])
   *
   * - options (Hash): Initial property values to be set on the Window instance
   *
   * Initializes a new instance of Aphid.UI.Window.
   */
  initialize: function($super, options)
  {
    options = $H(options);
    options.set("element", document.body);
    options.set("outlet", false);
    options.set("template", false);

    $super(options);
  },

  // Overlay -----------------------------------------------------------------

  /**
   * Aphid.UI.Window#getOverlayElement() -> Element
   *
   * Initializes (if necessary) and returns an element to be used as the
   * overlay.
  **/
  getOverlayElement: function()
  {
    if (!this.overlayElement)
    {
      this.overlayElement = new Element("div", { className: 'overlay' });
      this.overlayElement.hide();
      Element.insert(document.body, { top: this.overlayElement });
    }
    return this.overlayElement;
  },

  /**
   * Aphid.UI.Window#overlayVisible() -> Boolean
   *
   * Returns true or false depending on whether or not the overlay is
   * currently visible.
  **/
  overlayVisible: function()
  {
    return this.get("overlayElement").visible();
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
    $L.debug("Displaying Overlay (Animated: " + (animated ? "Yes" : "No") + ")", this);
    var overlayElement = this.get("overlayElement");
    if (animated)
      overlayElement.appear({ duration: 0.25, to: 0.6 });
    else
      overlayElement.show();
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
    $L.debug("Dismissing Overlay (Animated: " + (animated ? "Yes" : "No") + ")", this);
    var overlayElement = this.get("overlayElement");
    if (animated)
      overlayElement.fade({ duration: 0.25 });
    else
      overlayElement.hide();
  },

  // Loading Indicator -------------------------------------------------------

  /*
   * Aphid.UI.Window#getLoadingIndicatorView() -> Aphid.UI.LoadingIndicatorView
   *
   * Initializes (if necessary) and returns an instance of LoadingIndicatorView.
   */
  getLoadingIndicatorView: function()
  {
    if (!this.loadingIndicatorView)
      this.loadingIndicatorView = new Aphid.UI.LoadingIndicatorView();
    return this.loadingIndicatorView;
  },

  displayLoadingIndicator: function()
  {
    this.addSubviewAnimated(this.get("loadingIndicatorView"));
  },

  dismissLoadingIndicator: function()
  {
    this.get("loadingIndicatorView").removeFromSuperviewAnimated();
  },

  // Dynamic Resource Loading ------------------------------------------------

  loadResource: function(url)
  {
    if (url.match(/.js(\?.*)?$/))
      this._loadJavaScriptResource(url);
    else if (url.match(/.css(\?.*)?$/))
      this._loadStylesheetResource(url);
    else
      $L.error("Asked to load resource " + url, this);
  },

  _loadJavaScriptResource: function(url)
  {
    var documentHeader = $$("head").first();
    var scriptElement  = new Element("script", { src: url });
    documentHeader.appendChild(scriptElement);
  },

  _loadStylesheetResource: function(url)
  {
    var documentHeader = $$("head").first();
    var linkElement    = new Element("link", { href: url, rel: "stylesheet" });
    documentHeader.appendChild(linkElement);
  },

  // Document Text Selection -------------------------------------------------

  /*
   * Aphid.UI.Window#preventTextSelection() -> null
   *
   * Disables any text selection from occurring on the document. Text
   * selection can be re-enabled by calling [[Aphid.UI.Window#allowTextSelection]].
  **/
  preventTextSelection: function()
  {
    // document.onselectstart = function() { return false; }
    // this.element.observe('selectstart', function() { window.console.log("Foo"); return false; });
    document.body.setStyle({
      "-webkit-user-select": "none",
      "-moz-user-select": "none"
    });
  },

  /*
   * Aphid.UI.Window#allowTextSelection() -> null
   *
   * Allows text selection to occur on the document. This is normally called
   * after text selection has been suspended with a previous call to
   * [[Aphid.UI.Window#preventTextSelection]].
  **/
  allowTextSelection: function()
  {
    // document.onselectstart = null;
    document.body.setStyle({
      "-webkit-user-select": "auto",
      "-moz-user-select": "auto"
    });
  },

  // Custom Event Observers --------------------------------------------------

  _startObserving: function($super)
  {
    $super();

    // Window Resize Events
    if (this._handleResizeEvent && !this._handleResizeEventListener)
    {
      $L.debug("Observing for Resize Events", this);
      this._handleResizeEventListener = this._handleResizeEvent.bindAsEventListener(this);
      Event.observe(document.onresize ? document : window, "resize", this._handleResizeEventListener);
    }

    // "Before Unload" Events
    $L.debug("Observing for Unload Events", this);
    this._handleBeforeUnloadEventListener = this._handleBeforeUnloadEvent.bindAsEventListener(this);
    window.onbeforeunload = this._handleBeforeUnloadEventListener;
  },

  _stopObserving: function($super)
  {
    $super();

    // Window Resize Events
    if (this._handleResizeEventListener)
    {
      Event.stopObserving(document.onresize ? document : window, "resize", this._handleResizeEventListener);
      this._handleResizeEventListener = false;
    }
  },

  // Event Handlers ----------------------------------------------------------

  _handleResizeEvent: function(event)
  {
    this._layoutSubviews();
  },

  _handleBeforeUnloadEvent: function(event)
  {
    if (this.get("confirmBeforeLeaving"))
      return "By leaving this page you may lose any unsaved changes.";
    else
      return;
  }

});
