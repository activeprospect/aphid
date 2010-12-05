/**
 * class Aphid.UI.SplitViewController < Aphid.UI.ViewController
 *
 * Manages a split view layout with either two side-by-side views or views
 * stacked on top and bottom.
 *
 * Minimum and maximum widths as described in the min-width and max-width
 * properties of the left pane will be enforced.
 *
**/

Aphid.UI.SplitViewController = Class.create(Aphid.UI.ViewController, {

  displayName: "Aphid.UI.SplitViewController",

  /**
   * Aphid.UI.SplitViewController#firstView -> Aphid.UI.View | false
   *
   * The first view in split view. This is the view on the left when
   * [[Aphid.UI.SplitViewController#orientation]] is set to +vertical+ or the
   * view on the top when set to +horizontal+.
  **/
  firstView: false,

  /**
   * Aphid.UI.SplitViewController#secondView -> Aphid.UI.View | false
   *
   * The second view in split view. This is the view on the right when
   * [[Aphid.UI.SplitViewController#orientation]] is set to +vertical+ or the
   * view on the bottom when set to +horizontal+.
  **/
  secondView: false,

  /**
   * Aphid.UI.SplitViewController#orientation -> String | false
   *
   * The orientation of the split view, either "horizontal" or "vertical". If
   * no orientation is provided, the default is "vertical".
  **/
  orientation: false,

  /**
   * Aphid.UI.SplitViewController#mode -> String | false
   *
   * This property defines the mode of the split view controller.
   *
   * #### Example
   *
   *     splitViewController.set("mode", padded);
   *
   * #### Available Modes
   *
   * - **default** — This mode provides a visual divider that can be clicked
   *   on.
   * - **padded** — This mode provides equal padding between each pane with a
   *   drag handle image between each pane.
   * - **borderless** — This mode provides a split view with no borders, but
   *   with a drag area that straddles the two panes transparently.
  **/
  mode: false,

  /**
   * Aphid.UI.SplitViewController#isResizable -> Boolean
  **/
  isResizable: true,

  /**
   * Aphid.UI.SplitViewController#draggableInstance -> Draggable | false
   *
   * 
  **/
  draggableInstance: false,

  /**
   * Aphid.UI.SplitViewController#defaultPosition -> Integer | false
  **/
  defaultPosition: false,

  /**
   * Aphid.UI.SplitViewController#currentPosition -> Integer | false
  **/
  currentPosition: false,

  /**
   * Aphid.UI.SplitViewController#minPosition -> Integer | false
  **/
  minPosition: false,

  /**
   * Aphid.UI.SplitViewController#maxPosition -> Integer | false
  **/
  maxPosition: false,

  /**
   * Aphid.UI.SplitViewController#dragHandleClickOffset -> Integer | false
  **/
  dragHandleClickOffset: false,

  // Split View Configuration
  constraint: false, // "horizontal, vertical"

  // Initialization ----------------------------------------------------------

  initialize: function($super, options)
  {
    $super(options);
    if (!this.get("orientation")) this.set("orientation", "vertical");
  },

  _initializeDraggableInstance: function()
  {
    this.get("draggableInstance");
  },

  // View Callbacks ----------------------------------------------------------

  viewDidLoad: function($super)
  {
    $super();

    // Add CSS Classes
    this.get("element").addClassName("SplitViewController");
    this.get("element").addClassName(this.get("orientation"));
    if (this.get("mode") || !this.get("mode") == "default")
      this.get("element").addClassName(this.get("mode"));

    this._restoreState();

    if (Prototype.Browser.IE)
      return; // Resizing is not supported by Internet Explorer, yet...
  },

  viewDidAppear: function(animated)
  {
    if (!this.asynchronousLoadingEnabled)
      this._initializeDraggableInstance();

    // Vertical Layout
    if (this.get("orientation") == "vertical")
    {
      this.set("defaultPosition", this.get("firstView.element").getWidth());
      this.set("minPosition", this.get("firstView.element").getMinimumWidth());
      this.set("maxPosition", this.get("firstView.element").getMaximumWidth());
    }

    // Horizontal Layout
    else
    {
      this.set("defaultPosition", this.get("firstView.element").getHeight());
      this.set("minPosition", this.get("firstView.element").getMinimumHeight());
      this.set("maxPosition", this.get("firstView.element").getMaximumHeight());
    }

    this._startObserving();
  },

  viewWillDisappear: function(animated)
  {
    this._stopObserving();
  },

  // Draggable Callbacks -----------------------------------------------------

  draggableDidUpdatePosition: function(draggable, event)
  {
    $L.debug("draggableDidUpdatePosition", this);

    var offset      = this.get("firstView.element").cumulativeOffset(),
        clickOffset = this.get("dragHandleClickOffset"),
        minPosition = this.get("minPosition"),
        maxPosition = this.get("maxPosition");

    if (this.get("orientation") == "vertical")
    {
      if (event.clientX - clickOffset <= minPosition + offset[0])
      {
        this.resizeHorizontal(minPosition + offset[0]);
        // event.stop(event);
        this._resetDragHandlePosition();
        return;
      }
      else if (event.clientX - clickOffset >= maxPosition + offset[0])
      {
        this.resizeHorizontal(maxPosition + offset[0]);
        // event.stop(event);
        this._resetDragHandlePosition();
        return;
      }

      var width = event.clientX - this.dragHandleClickOffset;
      this.resizeHorizontal(width);
    }
    else
    {
      if (event.clientY - clickOffset <= minPosition + offset[1])
      {
        this.resizeVertical(minPosition + offset[1]);
        // event.stop();
        this._resetDragHandlePosition();
        return;
      }
      else if (event.clientY - clickOffset >= maxPosition + offset[1])
      {
        this.resizeVertical(maxPosition + offset[1]);
        // event.stop();
        this._resetDragHandlePosition();
        return;
      }

      var height = event.clientY - clickOffset;
      this.resizeVertical(height);
    }
    
  },

  draggableDidFinishDragging: function(draggable, event)
  {
    $L.debug("draggableDidFinishDragging", this);
    this._persistState();
    this._resetDragHandlePosition();
  },

  // Resize ------------------------------------------------------------------

  resizeHorizontal: function(x)
  {
    var cumulativeOffset = this.get("firstView.element").cumulativeOffset()[0],
        borderWidth      = isNaN(this.get("firstView.element").getBorderWidth()) ? 0 : this.get("firstView.element").getBorderWidth(),
        dragHandleWidth  = this.get("dragHandle").getWidth();
    this.get("firstView.element").setStyle({ width: x - cumulativeOffset + 'px' });
    this.get("secondView.element").setStyle({ left: (x - cumulativeOffset + borderWidth + dragHandleWidth) + 'px' });
    this.get("dragHandle").setStyle({ left: (x - cumulativeOffset + borderWidth) + 'px' });
  },

  resizeVertical: function(y)
  {
    var cumulativeOffset = this.get("firstView.element").cumulativeOffset()[1],
        borderHeight     = isNaN(this.get("firstView.element").getBorderHeight()) ? 0 : this.get("firstView.element").getBorderHeight(),
        dragHandleHeight = this.get("dragHandle").getHeight();
    this.get("firstView.element").setStyle({ height: y - cumulativeOffset + 'px' });
    this.get("secondView.element").setStyle({ top: (y - cumulativeOffset + borderHeight + dragHandleHeight) + 'px' });
    this.get("dragHandle").setStyle({ top: (y - cumulativeOffset + borderHeight) + 'px' });
  },

  // State Management --------------------------------------------------------

  _persistState: function()
  {
    if (this.get("orientation") == "vertical")
      $C.set(this.displayName + ".position", this.get("firstView.element").getWidth());
    else
    $C.set(this.displayName + ".position", this.get("firstView.element").getHeight());
  },

  _restoreState: function()
  {
    $L.info("_restoreState", "Blah");

    var paneSize = parseInt($C.get(this.displayName + ".position"));
    var offset   = this.get("firstView.element").cumulativeOffset();

    if (this.get("orientation") == "vertical")
      this.resizeHorizontal(paneSize + offset[0]);
    else
      this.resizeVertical(paneSize + offset[1]);
  },

  // Custom Accessors --------------------------------------------------------

  dragHandle: function()
  {
    if (!this._dragHandle)
    {
      this._dragHandle = new Element("div").addClassName("dragHandle");
      Element.insert(this.get("firstView.element"), { after: this._dragHandle });
    }
    return this._dragHandle;
  },

  draggableInstance: function()
  {
    if (!this._draggableInstance)
    {
      var draggableOptions = {
        constraint: this.get("orientation") == "vertical" ? "horizontal" : "vertical",
        onDrag: this.draggableDidUpdatePosition.bind(this),
        onEnd: this.draggableDidFinishDragging.bind(this),
        splitViewController: this
      }

      this._draggableInstance = new this.Draggable(this.get("dragHandle"), draggableOptions);
    }
    return this._draggableInstance;
  },

  // Event Handling ----------------------------------------------------------

  _startObserving: function()
  {

    // Observe "Mouse Down" Events
    this._handleMouseDownEventListener = this._handleMouseDownEvent.bindAsEventListener(this);
    this.get("dragHandle").observe("mousedown", this._handleMouseDownEventListener);

    // Observe "Mouse Up" Events
    this._handleMouseUpEventListener = this._handleMouseUpEvent.bindAsEventListener(this);
    this.get("dragHandle").observe("mouseup", this._handleMouseUpEventListener);

  },

  _stopObserving: function()
  {

    // Observe "Mouse Down" Events
    this.get("dragHandle").observe("mousedown", this._handleMouseDownEventListener);
    this._handleMouseDownEventListener = false;

    // Stop Observing "Mouse Up" Events
    this.get("dragHandle").stopObserving("mouseup", this._resetDragHandleClickOffsetListener);
    this._handleMouseUpEventListener = false;

  },

  _handleMouseDownEvent: function(event)
  {
    var dragHandle  = this.get("dragHandle"),
        firstView   = this.get("firstView.element");

    if (this.get("orientation") == 'horizontal')
    {
      var offset = (firstView.cumulativeOffset()[1] + firstView.getHeight() + dragHandle.getHeight()) - event.clientY;
      this.set("dragHandleClickOffset", dragHandle.getHeight() - offset);
    }
    else
    {
      var offset = (firstView.cumulativeOffset()[0] + firstView.getWidth() + dragHandle.getWidth()) - event.clientX;
      this.set("dragHandleClickOffset", dragHandle.getWidth() - offset);
    }
  },

  _handleMouseUpEvent: function(event)
  {
    this.set("dragHandleClickOffset", false);
    this._resetDragHandlePosition();
  },

  _resetDragHandlePosition: function()
  {
    var cumulativeOffset = this.get("firstView.element").cumulativeOffset()[0],
        borderWidth      = isNaN(this.get("firstView.element").getBorderWidth()) ? 0 : this.get("firstView.element").getBorderWidth(),
        dragHandleWidth  = this.get("dragHandle").getWidth();
    this.get("dragHandle").setStyle({ left: (this.get("firstView.element").getWidth() + cumulativeOffset + borderWidth) + 'px' });
  },

  validatePosition: function(position)
  {
    $L.debug("validatePosition (position: " + position + ")", this);
    var minPosition = this.get("minPosition") + this.get("dragHandleClickOffset"),
        maxPosition = this.get("maxPosition");
    return (position > minPosition && position < maxPosition);
  },

  // Draggable Subclass ------------------------------------------------------

  /* Custom Subclass of Scriptaculous' Draggable that will allow us to stop
   * the redraw if the user attempts to resize beyond the minimum or maximum
   * positions defined on the SplitViewController instance.
   */
  Draggable: Class.create(Draggable, {
    updateDrag: function($super, event, pointer)
    {
      var splitViewController = this.options.splitViewController,
          position            = (this.options.constraint == "vertical" ? event.clientY : event.clientX);

      if (splitViewController.validatePosition(position))
        $super(event, pointer);
    }
  })

});
