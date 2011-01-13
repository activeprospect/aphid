
Aphid.UI.PopoverView = Class.create(Aphid.UI.View, {

  displayName: "PopoverView",
  attachedView: false,

  getElement: function()
  {
    if (!this.element)
    {
      this.element = new Element("div", { className: "PopoverView" });
    }
    return this.element;
  },

  presentRelativeToView: function(view)
  {
    this.set("attachedView", view);
    $AppDelegate.get("mainWindow").addSubviewAnimated(this);
  },

  viewWillAppear: function()
  {
    if (this.get("attachedView"))
    {
      this.resizeToFitView();

      var cumulativeOffset = this.get("attachedView.element").cumulativeOffset(),
          dimensions       = this.get("attachedView.element").getDimensions();

      var top  = (cumulativeOffset.top  + dimensions.height) + 20,
          left = (cumulativeOffset.left + (dimensions.width / 2)) - (this.get("element").getWidth() / 2);

      this.get("element").setStyle({ top: top + "px", left: left + "px" });
    }
  },

  resizeToFitView: function()
  {
    var element    = this.get("subviews").first().get("element"),
        dimensions = element.getDimensions();

    this.get("element").setStyle({
      width: dimensions.width + "px",
      height: dimensions.height + "px"
    });
  }

});
