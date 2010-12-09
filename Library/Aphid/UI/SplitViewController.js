/**
 * class Aphid.UI.SplitViewController < Aphid.UI.ViewController
 *
 * Manages a split view layout with either two side-by-side views or views
 * stacked on top and bottom.
 *
 * Minimum and maximum widths as described in the min-width and max-width
 * properties of the left pane will be enforced.
 *
 * #### Subclassing Notes
 *
 * - `splitViewShouldResize(splitView)` — Called before a resize operation
 *   begins on the split view.
 *
 * - `splitViewWillResize(splitView)` — Called when the split view has started
 *   a resize operation, but has not completed.
 *
 * - `splitViewDidResize(splitView, position)` — Called after a resize
 *   operation on the split view has finished.
 *
 * #### Notifications
 *
 * - `SplitViewControllerResizedNotification` — Posted after a resize
 *   operation on the split view has finished.
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
   * Aphid.UI.SplitViewController#allowsResize -> Boolean
   *
   * If true, the user is allowed to resize the split view using their mouse
   * to drag the dragHandle.
   *
   * #### Example
   *
   *     splitViewController.set("allowsResizing", false);
   *
  **/
  allowsResize: true,

  /**
   * Aphid.UI.SplitViewController#draggableInstance -> Draggable | false
   *
   * An instance of our custom subclass of Scriptaculous' Draggable for this
   * instance of [[Aphid.UI.SplitViewController]].
   *
   * **Note:** This property is read-only.
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

  /*
   * Aphid.UI.SplitViewController#_dragHandleClickOffset -> Integer | false
   */
  _dragHandleClickOffset: false,

  // Initialization ----------------------------------------------------------

  initialize: function($super, options)
  {
    $super(options);
    if (!this.get("orientation")) this.set("orientation", "vertical");
  },

  // View Callbacks ----------------------------------------------------------

  viewDidLoad: function($super)
  {
    $super();

    // Add CSS Classes for Orientation and Mode
    this.get("element").addClassName(this.get("orientation"));
    if (this.get("mode") || !this.get("mode") == "default")
      this.get("element").addClassName(this.get("mode"));

    if (Prototype.Browser.IE)
      return; // Resizing is not supported by Internet Explorer, yet...

    if (this.get("allowsResize"))
    {
      this.get("element").addClassName("resizable");
      this.get("draggableInstance"); // Lazily Initialize
      this._restoreState();
    }
  },

  viewDidAppear: function(animated)
  {
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
        clickOffset = this._dragHandleClickOffset,
        minPosition = this.get("minPosition"),
        maxPosition = this.get("maxPosition");

    // Vertical Mode
    if (this.get("orientation") == "vertical")
    {
      if (event.clientX - clickOffset <= minPosition + offset[0])
      {
        this.resizeHorizontal(minPosition + offset[0]);
        return;
      }
      else if (event.clientX - clickOffset >= maxPosition + offset[0])
      {
        this.resizeHorizontal(maxPosition + offset[0]);
        return;
      }

      var width = event.clientX - clickOffset;
      this.resizeHorizontal(width);
    }

    // Horizontal Mode
    else
    {
      if (event.clientY - clickOffset <= minPosition + offset[1])
      {
        this.resizeVertical(minPosition + offset[1]);
        return;
      }
      else if (event.clientY - clickOffset >= maxPosition + offset[1])
      {
        this.resizeVertical(maxPosition + offset[1]);
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
    if (!this._shouldResize())
      return;

    var cumulativeOffset = this.get("firstView.element").cumulativeOffset()[0],
        borderWidth      = isNaN(this.get("firstView.element").getBorderWidth()) ? 0 : this.get("firstView.element").getBorderWidth(),
        dragHandleWidth  = this.get("dragHandle").getWidth();

    this._willResize();

    this.get("firstView.element").setStyle({ width: x - cumulativeOffset + 'px' });
    this.get("secondView.element").setStyle({ left: (x - cumulativeOffset + borderWidth + dragHandleWidth) + 'px' });
    this.get("dragHandle").setStyle({ left: (x - cumulativeOffset + borderWidth) + 'px' });

    this._didResize();
  },

  resizeVertical: function(y)
  {
    if (!this._shouldResize())
      return;

    var cumulativeOffset = this.get("firstView.element").cumulativeOffset()[1],
        borderHeight     = isNaN(this.get("firstView.element").getBorderHeight()) ? 0 : this.get("firstView.element").getBorderHeight(),
        dragHandleHeight = this.get("dragHandle").getHeight();

    this._willResize();

    this.get("firstView.element").setStyle({ height: y - cumulativeOffset + 'px' });
    this.get("secondView.element").setStyle({ top: (y - cumulativeOffset + borderHeight + dragHandleHeight) + 'px' });
    this.get("dragHandle").setStyle({ top: (y - cumulativeOffset + borderHeight) + 'px' });

    this._didResize();
  },

  // State Management --------------------------------------------------------

  _persistState: function()
  {
    $L.debug("_persistState", this);

    if (this.get("orientation") == "vertical")
      $C.set(this.displayName + ".position", this.get("firstView.element").getWidth());
    else
      $C.set(this.displayName + ".position", this.get("firstView.element").getHeight());
  },

  _restoreState: function()
  {
    $L.debug("_restoreState", this);

    var paneSize = parseInt($C.get(this.displayName + ".position"));
    var offset   = this.get("firstView.element").cumulativeOffset();

    if (this.get("orientation") == "vertical")
      this.resizeHorizontal(paneSize + offset[0]);
    else
      this.resizeVertical(paneSize + offset[1]);

    this._didResize();
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
    var dragHandle = this.get("dragHandle"),
        firstView  = this.get("firstView.element");

    if (this.get("orientation") == 'horizontal')
    {
      var offset = (firstView.cumulativeOffset()[1] + firstView.getHeight() + dragHandle.getHeight()) - event.clientY;
      this._dragHandleClickOffset = dragHandle.getHeight() - offset;
    }
    else
    {
      var offset = (firstView.cumulativeOffset()[0] + firstView.getWidth() + dragHandle.getWidth()) - event.clientX;
      this._dragHandleClickOffset = dragHandle.getWidth() - offset;
    }
  },

  _handleMouseUpEvent: function(event)
  {
    this._dragHandleClickOffset = false;
    this._resetDragHandlePosition();
  },

  _resetDragHandlePosition: function()
  {
    var firstViewElement = this.get("firstView.element"),
        cumulativeOffset = firstViewElement.cumulativeOffset();

    if (this.get("orientation") == "horizontal")
    {
      var offset           = cumulativeOffset[1],
          borderHeight     = isNaN(firstViewElement.getBorderHeight()) ? 0 : firstViewElement.getBorderHeight();

      // this.get("dragHandle").setStyle({ top: (firstViewElement.getHeight() + offset + borderHeight) + "px" });
      this.get("dragHandle").setStyle({ top: (firstViewElement.getHeight() + borderHeight) + "px" });
    }
    else
    {
      var offset          = cumulativeOffset[0],
          borderWidth     = isNaN(firstViewElement.getBorderWidth()) ? 0 : firstViewElement.getBorderWidth();

      // this.get("dragHandle").setStyle({ left: (firstViewElement.getWidth() + offset + borderWidth) + "px" });
      this.get("dragHandle").setStyle({ left: (firstViewElement.getWidth() + borderWidth) + "px" });
    }
  },

  validatePosition: function(position)
  {
    $L.debug("validatePosition (position: " + position + ")", this);
    var minPosition = this.get("minPosition") + this._dragHandleClickOffset;
        maxPosition = this.get("maxPosition");
    return (position > minPosition && position < maxPosition);
  },

  // Callbacks ---------------------------------------------------------------

  _shouldResize: function()
  {
    $L.debug("_shouldResize", this);
    var shouldResize = true;
    if (this.shouldResize)
      shouldResize = this.shouldResize(this);
    if (this.delegate && this.delegate.splitViewShouldResize)
      shouldResize = this.delegate.splitViewShouldResize(this);
    return shouldResize;
  },

  _willResize: function()
  {
    $L.debug("_willResize", this);
    if (this.willResize)
      this.willResize(this);
    if (this.delegate && this.delegate.splitViewWillResize)
      this.delegate.splitViewWillResize(this);
  },

  _didResize: function()
  {
    $L.debug("_didResize", this);
    if (this.didResize)
      this.didResize(this);
    if (this.delegate && this.delegate.splitViewDidResize)
      this.delegate.splitViewDidResize(this);
    $AppDelegate.notificationCenter.postNotification("SplitViewControllerResizedNotification");
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
