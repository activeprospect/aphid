/**
 * class Aphid.UI.PopoverView < Aphid.UI.View
**/

Aphid.UI.PopoverView = Aphid.Class.create("Aphid.UI.PopoverView", Aphid.UI.View, {

  /**
   * Aphid.UI.PopoverView -> View | false
  **/
  attachedView: false,

  /**
   * Aphid.UI.position -> String
  **/
  position: false,

  contentView: false,
  triangleElement: false,

  initialize: function($super, options)
  {
    $super(options);
    this.attachedView = false;
    this.position = "top";
  },

  viewDidLoad: function($super)
  {
    $super();

    // Add Triangle Element
    if (!this.triangleElement)
    {
      this.triangleElement = new Element("div", { className: "triangle" });
      this.get("element").insert(this.triangleElement);
    }

    // Add Container View
    if (!this.contentView)
    {
      this.contentView = new Aphid.UI.View({ delegate: this });
      this.contentView.get("element").addClassName("contentView");
      this.addSubview(this.contentView);
    }
  },

  viewWillAppear: function()
  {
    window.console.log(this.get("attachedView"))
    if (this.get("attachedView"))
    {
      this.resizeToFitView();

      var viewportOffset = this.get("attachedView.element").viewportOffset(),
          dimensions     = this.get("attachedView.element").getDimensions();

      var top, left;
      switch(this.get("position"))
      {

        case "top":
          top  = viewportOffset.top - this.get("element").getOuterHeight();
          left = (viewportOffset.left + (dimensions.width / 2)) - (this.get("element").getOuterWidth() / 2);
          break;

        case "bottom":
          top = viewportOffset.top + dimensions.height;
          left = (viewportOffset.left + (dimensions.width / 2)) - (this.get("element").getOuterWidth() / 2);
          break;

        case "left":
          top = (viewportOffset.top + (dimensions.height / 2)) - (this.get("element").getOuterHeight() / 2);
          left = viewportOffset.left - this.get("element").getOuterWidth();
          break;

        case "right":
          top = (viewportOffset.top + (dimensions.height / 2)) - (this.get("element").getOuterHeight() / 2);
          left = viewportOffset.left + dimensions.width;
          break;

      }

      // Adjust for Screen
      var adjustment = 0;
      if (left < 0)
      {
        adjustment = ((left * -1) + 20) * -1;
        left = 20;
        var marginLeft = parseInt(this.get("triangleElement").getStyle("margin-left")) + adjustment;
        this.get("triangleElement").setStyle("margin-left: " + marginLeft + "px");
        $L.info("Adjusting triangle position by " + marginLeft + " pixels")
      }

      this.get("element").setStyle({ top: top + "px", left: left + "px" });
    }
  },

  viewDidAppear: function()
  {

    // Document Click Events
    if (this.handleDocumentClickEvent && !this._handleDocumentClickEventListener)
    {
      $L.debug("Observing for Document Click Events", this);
      this._handleDocumentClickEventListener = this.handleDocumentClickEvent.bindAsEventListener(this);
      Event.observe(document, "click", this._handleDocumentClickEventListener);
    }

  },

  viewDidDisappear: function()
  {

    // Document Click Events
    if (this._handleDocumentClickEventListener)
    {
      Event.stopObserving(document, "click", this._handleDocumentClickEventListener);
      this._handleDocumentClickEventListener = false;
    }

  },

  presentRelativeToView: function(view, position)
  {
    if (Object.isUndefined(position)) position = "top";
    this.set("attachedView", view);
    this.set("position", position);
    $AppDelegate.get("mainWindow").addSubviewAnimated(this);

    this.get("element").removeClassName("top");
    this.get("element").removeClassName("right");
    this.get("element").removeClassName("bottom");
    this.get("element").removeClassName("left");
    this.get("element").addClassName(position);
  },

  resizeToFitView: function()
  {
    var firstSubview = this.get("contentView.subviews").first();
    if (!firstSubview) return;

    var element    = firstSubview.get("element"),
        dimensions = element.getDimensions();

    this.get("contentView.element").setStyle({
      width: dimensions.width + "px",
      height: dimensions.height + "px"
    });
    this.get("element").setStyle({
      width: dimensions.width + "px",
      height: dimensions.height + "px"
    });
  },

  // Event Handlers ----------------------------------------------------------

  handleClickEvent: function(event, element)
  {
    // this.removeFromSuperviewAnimated();
  },

  handleDocumentClickEvent: function(event)
  {
    var element = event.element();

    if (element == this.get("element") || (element != this.get("element") && element.descendantOf(this.get("element"))))
      return;

    $L.info("handleDocumentClickEvent", this);

    this.removeFromSuperviewAnimated();
  }


});
