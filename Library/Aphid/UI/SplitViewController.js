/**
 * class Aphid.UI.SplitViewController < Aphid.UI.ViewController
 *
 * This class (which extends Draggable from Scriptaculous) handles the
 * resizing of two horizontally adjacent panes.
 *
 * Minimum and maximum widths as described in the min-width and max-width
 * properties of the left pane will be enforced.
 *
**/

Aphid.UI.SplitViewController = Class.create(Aphid.UI.ViewController, {

  displayName: "Aphid.UI.SplitViewController",

  // Panes
  firstView: false,
  secondView: false,

  // SplitView Configuration
  constraint: false, // "horizontal, vertical"

  // Instance Properties
  draggableInstance: false,

  // Initialization ----------------------------------------------------------

  initialize: function($super, options)
  {
    $super(options);
  },

  _initializeDraggableInstance: function()
  {
    if (Prototype.Browser.IE)
      return; // Resizing is not supported by Internet Explorer, yet...

    var minHeight = parseInt(this.firstView.element.getStyle('min-height')),
        maxHeight = parseInt(this.firstView.element.getStyle('max-height')),
        minWidth  = parseInt(this.firstView.element.getStyle('min-width')),
        maxWidth  = parseInt(this.firstView.element.getStyle('max-width'));

    this.draggableInstance = new Aphid.UI.SplitViewController.Draggable(
      this.firstView.element,
      this.secondView.element,
      {
        constraint: this.constraint,
        minHeight: minHeight,
        maxHeight: maxHeight,
        minWidth: minWidth,
        maxWidth: maxWidth,
        onStart: this.onStart.bind(this),
        onDrag: this.onDrag.bind(this),
        change: this.change.bind(this),
        onEnd: this.onEnd.bind(this),
        controller: this
      });
  },

  // View Callbacks ----------------------------------------------------------

  viewDidLoad: function($super)
  {
    $super();

    this.get("element").addClassName("SplitViewController");
    this.get("element").addClassName(this.constraint || "horizontal");

    if (!this.asynchronousLoadingEnabled)
      this._initializeDraggableInstance();
  },

  // View Delegates ----------------------------------------------------------

  viewDidLoadAsynchronously: function(view)
  {
    if (!this.firstView && !this.secondView)
    {
      $L.error("firstView and secondView have not been defined", this);
      return;
    }
    if (this.firstView.isLoaded && this.secondView.isLoaded)
      this._initializeDraggableInstance();
  },

  // Pane Callbacks ----------------------------------------------------------

  onStart: function(arg)
  {
    $L.debug("onStart", this);
  },

  onDrag: function(arg)
  {
    $L.debug("onDrag", this);
  },

  change: function(arg)
  {
    $L.debug("change", this);
  },

  onEnd: function(arg)
  {
    $L.debug("onEnd", this);
  }

});

/*
 * class Aphid.UI.SplitViewController.Draggable
 *
 * Draggable is a custom subclass of Draggable from script.aculo.us that adds
 * support for minimum/maximum widths and heights, as defined by the
 * min-width and min-height CSS properties.
 *
 * ### TODO
 * 
 *  * Move some of the logic out of this to a delegate or callback
 */
Aphid.UI.SplitViewController.Draggable = Class.create(Draggable, {

  displayName: "Aphid.UI.SplitViewController.Draggable",

  // DOM Elements
  firstPane: null,
  secondPane: null,
  dragHandle: null,

  // Callbacks
  afterResize: null,

  initialize: function($super, firstPane, secondPane)
  {
    var options = arguments[3] || { };
    if (!options.constraint)
      options.constraint = 'horizontal';

    this.firstPane = $(firstPane);
    this.secondPane = $(secondPane);

    // Set up Drag Handle
    this._insertDragHandle(options.constraint);
    $super(this.dragHandle, options);
    this._setupObservers();
    this._restoreState();
//    this._initializePaneDimensions();
  },

  updateDrag: function($super, event, pointer)
  {
    $L.debug("updateDrag", this);
    var minWidth, maxWidth, minHeight, maxHeight;
    var offset = this.firstPane.cumulativeOffset();

    if (this.options.constraint == 'vertical')
    {
      minHeight = this.firstPane.getMinimumHeight();
      maxHeight = this.firstPane.getMaximumHeight();

      if (event.clientY - this.dragHandleClickOffset <= minHeight + offset[1])
      {
        this.resizeVertical(minHeight + offset[1]);
        this._persistState();
        return;
      }
      else if (event.clientY - this.dragHandleClickOffset >= maxHeight + offset[1])
      {
        this.resizeVertical(maxHeight + offset[1]);
        this._persistState();
        return;
      }
    
      $super(event, pointer);

      var height = event.clientY - this.dragHandleClickOffset;
      this.resizeVertical(height);
      // this.resizeVertical(event.clientY - offset[1]);
    }
    else
    {
      minWidth = this.firstPane.getMinimumWidth();
      maxWidth = this.firstPane.getMaximumWidth();

      if (event.clientX - this.dragHandleClickOffset <= minWidth + offset[0])
      {
        this.resizeHorizontal(minWidth + offset[0]);
        this._persistState();
        return;
      }
      else if (event.clientX - this.dragHandleClickOffset >= maxWidth + offset[0])
      {
        this.resizeHorizontal(maxWidth + offset[0]);
        this._persistState();
        return;
      }

      $super(event, pointer);

      var width = event.clientX - this.dragHandleClickOffset;
      this.resizeHorizontal(width);
    }
  },

  resizeHorizontal: function(x)
  {
    var cumulativeOffset = this.firstPane.cumulativeOffset()[0],
        borderWidth      = isNaN(this.firstPane.getBorderWidth()) ? 0 : this.firstPane.getBorderWidth(),
        dragHandleWidth  = this.dragHandle.getWidth();
    this.firstPane.setStyle({ width: x - cumulativeOffset + 'px' });
    this.secondPane.setStyle({ left: (x - cumulativeOffset + borderWidth + dragHandleWidth) + 'px' });
    this.dragHandle.setStyle({ left: (x - cumulativeOffset + borderWidth) + 'px' });
  },

  resizeVertical: function(y)
  {
    var cumulativeOffset = this.firstPane.cumulativeOffset()[1],
        borderHeight     = isNaN(this.firstPane.getBorderHeight()) ? 0 : this.firstPane.getBorderHeight(),
        dragHandleHeight = this.dragHandle.getHeight();
    this.firstPane.setStyle({ height: y - cumulativeOffset + 'px' });
    this.secondPane.setStyle({ top: (y - cumulativeOffset + borderHeight + dragHandleHeight) + 'px' });
    this.dragHandle.setStyle({ top: (y - cumulativeOffset + borderHeight) + 'px' });
  },

  // State Management --------------------------------------------------------

  _persistState: function()
  {
    if (this.options.constraint == 'vertical')
      $C.set(this.options.controller.displayName + ".position", this.firstPane.getHeight());
    else
      $C.set(this.options.controller.displayName + ".position", this.firstPane.getWidth());
  },
  
  _restoreState: function()
  {
    $L.info("_restoreState", "Blah");

    var paneSize = parseInt($C.get(this.options.controller.displayName + ".position"));
    var offset   = this.firstPane.cumulativeOffset();

    if (this.options.constraint == 'vertical')
      this.resizeVertical(paneSize + offset[1]);
    else
      this.resizeHorizontal(paneSize + offset[0]);
  },

  // _initializePaneDimensions: function()
  // {
  //   if (this.options.constraint == 'vertical')
  //   {
  //     var topOffset = parseInt(this.dragHandle.getStyle('top')) + parseInt(this.dragHandle.getStyle('height'));
  //     this.secondPane.setStyle('top: ' + topOffset  + 'px');
  //   }
  //   else
  //   {
  //     // var leftOffset = parseInt(this.firstPane.getStyle('width')) + parseInt(this.firstPane.getStyle('left')) + parseInt(this.dragHandle.getStyle('width'))
  //     var leftOffset = parseInt(this.dragHandle.getStyle('left')) + parseInt(this.dragHandle.getStyle('width'));
  //     this.secondPane.setStyle('left: ' + leftOffset + 'px');
  //   }
  // },

  // Drag Handle -------------------------------------------------------------

  _insertDragHandle: function(constraint)
  {
    this.dragHandle = new Element("div").addClassName("dragHandle");
    this.dragHandle.addClassName(constraint);
    Element.insert(this.firstPane, { after: this.dragHandle });
  },

  _setupObservers: function()
  {
    this.dragHandle.observe('mouseup', this._resetDragHandleClickOffset.bind(this));
    this.dragHandle.observe('mousedown', this._determineDragHandleClickOffset.bind(this));
  },

  _determineDragHandleClickOffset: function(event)
  {
    if (this.options.constraint == 'vertical')
    {
      var offset = (this.firstPane.cumulativeOffset()[1] + this.firstPane.getHeight() + this.dragHandle.getHeight()) - event.clientY;
      this.dragHandleClickOffset = this.dragHandle.getHeight() - offset;
    }
    else
    {
      var offset = (this.firstPane.cumulativeOffset()[0] + this.firstPane.getWidth() + this.dragHandle.getWidth()) - event.clientX;
      this.dragHandleClickOffset = this.dragHandle.getWidth() - offset;
    }
  },

  _resetDragHandleClickOffset: function(event)
  {
    this.dragHandleClickOffset = null;
    this._persistState();
  }

});
