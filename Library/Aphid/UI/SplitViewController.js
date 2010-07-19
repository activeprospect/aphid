/**
 * class Aphid.UI.SplitViewController
 *
 * This class (which extends Draggable from Scriptaculous) handles the
 * resizing of two horizontally adjacent panes.
 *
 * Minimum and maximum widths as described in the min-width and max-width
 * properties of the left pane will be enforced.
 *
 * ### TODO
 * 
 *  * Allow min-width/max-width to be enforced on the right pane
 *  * Allow this to work with vertical panes as well
 *  * Automatically detect vertical or horizontal if possible
 *  * Automatically setup the drag handle if/when possible
 *  * Fix issue where the drag handle isn't moved centered (set background of dragHandle to red to illustrate)
 *  * Implement dblclick support (both with a callback and default behavior minimizing the left pane)
 *
**/

Aphid.UI.SplitViewController = Class.create(Aphid.UI.ViewController, {

  // Panes
  firstView: false,
  secondView: false,

  // Draggable Instance
  draggableInstance: false,

  constraint: false, // "horizontal, vertical"

  initialize: function($super, options)
  {
    $super(options);
  },

  viewDidLoad: function($super)
  {
    $super();

    $L.info('viewDidLoad', 'Aphid.UI.SplitViewController');
    this.element.addClassName('SplitViewController');
  },

  viewDidFinishLoading: function(view)
  {
    if (view == this.firstView)
    {
      var minHeight = parseInt(this.firstView.element.getStyle('min-height')),
          maxHeight = parseInt(this.firstView.element.getStyle('max-height'));
    }

    if (this.firstView.isLoaded && this.secondView.isLoaded)
    {
      this.draggableInstance = new Aphid.UI.SplitViewController.Draggable(
        this.firstView.element,
        this.secondView.element,
        {
          constraint: 'vertical',
          minHeight: minHeight,
          maxHeight: maxHeight,
          onStart: this.onStart.bind(this),
          onDrag: this.onDrag.bind(this),
          change: this.change.bind(this),
          onEnd: this.onEnd.bind(this)
        });
    }
  },

  // Pane Callbacks ----------------------------------------------------------

  onStart: function(arg)
  {
    $L.info("onStart", "Aphid.UI.SplitViewController");
  },

  onDrag: function(arg)
  {
    $L.info("onDrag", "Aphid.UI.SplitViewController");
  },

  change: function(arg)
  {
    $L.info("change", "Aphid.UI.SplitViewController");
  },

  onEnd: function(arg)
  {
    $L.info("onEnd", "Aphid.UI.SplitViewController");
  },

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
**/
Aphid.UI.SplitViewController.Draggable = Class.create(Draggable, {

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
    this._initializePaneDimensions();
  },

  updateDrag: function($super, event, pointer)
  {
    $L.info("updateDrag", "Aphid.UI.SplitViewController.Draggable")
    var minWidth, maxWidth, minHeight, maxHeight;
    var offset = this.firstPane.cumulativeOffset();

    if (this.options.constraint == 'vertical')
    {
      minHeight = parseInt(this.firstPane.getStyle('min-height'));
      maxHeight = parseInt(this.firstPane.getStyle('max-height'));

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
      minWidth = parseInt(this.firstPane.getStyle('min-width'));
      maxWidth = parseInt(this.firstPane.getStyle('max-width'));

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
    this.firstPane.setStyle({ width: x - this.firstPane.cumulativeOffset()[0] + 'px' });
    this.secondPane.setStyle({ left: x + this.dragHandle.getWidth() + 'px' });
    this.dragHandle.setStyle({ left: x + 'px' });
  },

  resizeVertical: function(y)
  {
    this.firstPane.setStyle({ height: y - this.firstPane.cumulativeOffset()[1] + 'px' });
    this.secondPane.setStyle({ top: (y - this.firstPane.cumulativeOffset()[1] + this.dragHandle.getHeight()) + 'px' });
    this.dragHandle.setStyle({ top: (y - this.firstPane.cumulativeOffset()[1]) + 'px' });
  },

  // State Management --------------------------------------------------------

  _persistState: function()
  {
    if (this.options.constraint == 'vertical')
      $C.set("ResizablePanes." + this.paneSet, this.firstPane.getHeight());
    else
      $C.set("ResizablePanes." + this.paneSet, this.firstPane.getWidth());
  },
  
  _restoreState: function()
  {
    var paneSize = parseInt($C.get("ResizablePanes." + this.paneSet));
    var offset   = this.firstPane.cumulativeOffset();

    if (this.options.constraint == 'vertical')
      this.resizeVertical(paneSize + offset[1]);
    else
      this.resizeHorizontal(paneSize + offset[0]);
  },

  _initializePaneDimensions: function()
  {
    if (this.options.constraint == 'vertical')
    {
      var topOffset = parseInt(this.dragHandle.getStyle('top')) + parseInt(this.dragHandle.getStyle('height'));
      this.secondPane.setStyle('top: ' + topOffset  + 'px');
    }
    else
    {
      // var leftOffset = parseInt(this.firstPane.getStyle('width')) + parseInt(this.firstPane.getStyle('left')) + parseInt(this.dragHandle.getStyle('width'))
      var leftOffset = parseInt(this.dragHandle.getStyle('left')) + parseInt(this.dragHandle.getStyle('width'));
      this.secondPane.setStyle('left: ' + leftOffset + 'px');
    }
  },

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
