/**
 * class Aphid.UI.MatrixView < Aphid.UI.View
 *
 * ### Delegate Methods
 *
 * - `matrixViewShouldSelectItem`
 * - `matrixViewDidSelectItem`
 * - `matrixViewShouldDeselectItem`
 * - `matrixViewDidDeselectItem`
 * - `matrixViewSelectionDidChange`
 * - `matrixViewShouldOpenItem`
 * - `matrixViewWillOpenItem`
 * - `matrixViewShouldDeleteItem`
 * - `matrixViewWillDeleteItem`
 *
**/

Aphid.UI.MatrixView = Class.create(Aphid.UI.View, {

  displayName: "Aphid.UI.MatrixView",

  /*
   * Aphid.UI.MatrixView#_selectionOverlayElement -> Element | false
   *
   * The semi-translucent overlay element that is displayed above items in the
   * view during a mouse drag-select operation.
   */
  _selectionOverlayElement: false,

  _isObserving: false,
  _isDragging: false,

  _originX: false,
  _originY: false,

  // Selected Items
  selectedItems: false,

  // -------------------------------------------------------------------------

  initialize: function($super, options)
  {
    $super(options);

    this.selectedItems = $A();
  },

  viewDidLoad: function($super)
  {
    this.get("element").addClassName("MatrixView");
  },

  // -------------------------------------------------------------------------

  /*
   * Aphid.UI.MatrixView#selectionOverlayElement()  -> Element
   *
   * Initializes (if necessary) and returns an element to be used as the
   * overlay.
   */
  selectionOverlayElement: function()
  {
    if (!this._selectionOverlayElement)
    {
      this._selectionOverlayElement = new Element("div", { className: 'selectionOverlay' });
      this._selectionOverlayElement.hide();
      this.get("element").insert({ top: this._selectionOverlayElement });
    }
    return this._selectionOverlayElement;
  },

  // Selection ---------------------------------------------------------------

  /**
   * Aphid.UI.MatrixView#select(element, event) -> Boolean
  **/
  select: function(element, event)
  {
    $L.info("select", this);

    // Multiple Selection (Shift-Select)
    if (event && event.shiftKey)
    {
      // Find first selected item
      var firstSelectedElement      = this.get("element").down("li.selected");
      var firstSelectedElementIndex = this.items().indexOf(firstSelectedElement);
      var selectedElementIndex      = this.items().indexOf(element);

      // If the first selected element is the element that was clicked on
      // then there's nothing for us to do.
      if (firstSelectedElement == element) return;

      // If no elements are selected already, just select the element that
      // was clicked on.
      if (firstSelectedElementIndex == -1)
      {
        this.select(element);
        return;
      }

      var siblings = null
      if (firstSelectedElementIndex < selectedElementIndex)
        siblings = firstSelectedElement.nextSiblings();
      else
        siblings = firstSelectedElement.previousSiblings();
      var done = false;
      siblings.each(function(el) {
        if (done == false)
        {
          el.addClassName('selected')
          this.selectedItems.push(el)
        }
        if (element == el) done = true;
      }, this);
    }

    // Multiple Selection (Meta-Select)
    else if (event && event.metaKey)
    {
      // If the element is already selected, deselect it
      if (element.hasClassName('selected'))
      {
        this.selectedItems = this.selectedItems.without(element)
        element.removeClassName('selected')
      }

      // Otherwise, select it
      else
      {
        this.selectedItems.push(element)
        element.addClassName('selected')
      }
    }

    // Single Selection (Single Click)
    else
    {
      // TODO Should this be deselectAll?
      this.get("element").select(".selected").invoke("removeClassName", "selected");
      this.selectedItems = $A(element);
      element.addClassName("selected");
    }

    // If a custom select handler has been defined, call it
    if (this.selectHandler != null)
      this.selectHandler(element)
  },

  selectAll: function()
  {
    $L.info("selectAll", this);
    this.deselectAll();
    this.get("element").select("li").each(function(el) {
      el.addClassName('selected');
      this.selectedItems.push(el);
    }, this);

    // If a custom select handler has been defined, call it
    if (this.selectHandler != null)
      this.selectHandler(this.selectedItems)
  },

  selectFirst: function()
  {
    $L.info("selectFirst", this);

    var element = this.get("element").down("li");

    this.deselectAll();
    this.select(element);

    this.scrollIntoView(element, 'down');

    // If a custom select handler has been defined, call it
    if (this.selectHandler != null)
      this.selectHandler(element);
  },

  selectLast: function()
  {
    $L.info("selectLast", this);

    var element = this.get("element").select("li").last();

    this.deselectAll();
    this.select(element);

    this.scrollIntoView(element, 'down');

    // If a custom select handler has been defined, call it
    if (this.selectHandler != null)
      this.selectHandler(element);
  },

  deselectAll: function()
  {
    $L.info("deselectAll", this);

    // TODO This should probably call deselectAll (or the private version)
    this.get("element").select('.selected').invoke("removeClassName", "selected");
    this.set("selectedItems", $A());

    // If a custom deselect handler has been defined, call it
    if (this.deselectHandler != null)
      this.deselectHandler();
  },

  expandSelectionLeft: function(event)
  {
    $L.info("expandSelectionLeft", this);
    var element = this.element.down('li.selected');
    var otherElement = element.previous();
    otherElement.addClassName('selected');
    this.get("selectedItems").push(otherElement);

    this.scrollIntoView(element, 'up');

    // If a custom select handler has been defined, call it
    if (this.selectHandler != null)
      this.selectHandler(element);
  },

  expandSelectionRight: function(event)
  {
    $L.info("expandSelectionRight", this);
    var element = this.element.getElementsBySelector('li.selected').last();
    var otherElement = element.next();
    otherElement.addClassName('selected');
    this.get("selectedItems").push(otherElement);

    this.scrollIntoView(element, 'down');

    // If a custom select handler has been defined, call it
    if (this.selectHandler != null)
      this.selectHandler(element);
  },

  expandSelectionUp: function(event)
  {
    $L.info("expandSelectionUp", this);
    event.stop();
    var element = this.element.down("li.selected");
    var itemWidth = element.getWidth();
    var itemOffset = Position.cumulativeOffset(element);
    var done = false;
    element.previousSiblings().each(function(el) {
      if (done == false)
      {
        el.addClassName('selected');
        this.get("selectedItems").push(el);
      }
      if (Position.within(el, itemOffset[0], itemOffset[1] - element.getHeight()))
      {
        done = true;
        this.scrollIntoView(el, 'up');
      }
    }, this);

    // If a custom select handler has been defined, call it
    if (this.selectHandler != null)
      this.selectHandler(element);
  },

  expandSelectionDown: function(event)
  {
    $L.info("expandSelectionDown", this);
    event.stop();
    var element = this.get("element").select(".selected").last();

    var offset = Position.cumulativeOffset(element);
    var y = Math.floor(offset[1] + element.getHeight() + (element.getHeight() / 2)) + parseInt($(element).getStyle("margin-bottom"));

    var done = false;
    element.nextSiblings().each(function(el) {
      if (done == false)
      {
        el.addClassName('selected');
        this.selectedItems.push(el);
      }
      if (Position.within(el, offset[0], y))
      {
        done = true;
        this.scrollIntoView(el, 'down');
      }
    }, this);
 
    // If a custom select handler has been defined, call it
    if (this.selectHandler != null)
      this.selectHandler(element);
  },

  // Actions -----------------------------------------------------------------

  open: function(element)
  {
    $L.info("open", this);
    this.deselectAll();
    element.addClassName('selected');
    // If a custom open handler has been defined, call it
    if (this.openHandler != null)
      this.openHandler(element);
  },

  destroy: function(elements)
  {
    $L.info("destroy", this);
    // If a custom open handler has been defined, call it
    if (this.deleteHandler != null)
      this.deleteHandler(elements);
  },

  // Movement ----------------------------------------------------------------

  moveLeft: function(event)
  {
    $L.info("moveLeft", this);

    event.stop();

    var element         = this.get("element").down(".selected");
    var previousElement = element ? element.previous() : false;
    if (!element || !previousElement) return this.selectFirst();

    this.select(previousElement);
    this.scrollIntoView(previousElement, 'up');
  },

  moveRight: function(event)
  {
    $L.info("moveRight", this);

    event.stop();

    var element = this.get("element").select(".selected").last();
    if (!element) return this.selectFirst();

    var nextElement = element.next();
    if (nextElement)
    {
      this.select(nextElement);
      this.scrollIntoView(nextElement, 'down');
    }
    else
      this.selectLast();
  },

  moveUp: function(event)
  {
    $L.info("moveUp", this);

    event.stop()

    var element = this.get("element").down(".selected");
    if (!element) return this.selectFirst();

    var offset = Position.cumulativeOffset(element);
    var y = Math.floor(offset[1] - element.getHeight());

    var previousSiblings = element.previousSiblings();
    if (previousSiblings.size() == 0) return this.selectFirst();

    previousSiblings.each(
      function(el) {
        if (Position.within(el, offset[0], y))
        {
          this.select(el);
          this.scrollIntoView(el, 'up');
        }
      }.bind(this)
    )

  },

  moveDown: function(event)
  {
    $L.info("moveDown", this);

    event.stop()

    var element = this.get("element").select(".selected").last();
    if (!element) return this.selectFirst();

    var offset = Position.cumulativeOffset(element);
    var y = Math.floor(offset[1] + element.getHeight() + (element.getHeight() / 2)) + parseInt($(element).getStyle('margin-bottom'));

    var nextSiblings = element.nextSiblings();
    if (nextSiblings.size() == 0) return this.selectLast();

    var selected = false;

    nextSiblings.each(
      function(el) {
        if (Position.within(el, offset[0], y))
        {
          this.select(el);
          this.scrollIntoView(el, 'down');
          selected = true;
        }
      }.bind(this)
    )

    if (!selected) this.selectLast();
  },

  items: function()
  {
    return this.get("element").select("li");
  },

  scrollIntoView: function(element, direction)
  {
    var scrollingView = this.get("element");
    if (direction == "down" || direction == "right")
    {
      if ((Position.page(element)[1] + element.getHeight()) >= (scrollingView.getHeight() + Position.cumulativeOffset(scrollingView)[1]))
        scrollingView.scrollTop = (Position.cumulativeOffset(element)[1] - scrollingView.getHeight() + element.getHeight());
      else if (Position.page(element)[1] <= 0)
        scrollingView.scrollTop = (Position.cumulativeOffset(element)[1] - scrollingView.getHeight() + element.getHeight());
    }
    else if (direction == "up" || direction == "left")
    {
      if ((Position.page(element)[1] + element.getHeight()) >= (scrollingView.getHeight() + Position.cumulativeOffset(scrollingView)[1]))
        scrollingView.scrollTop = (Position.cumulativeOffset(element)[1] - parseInt(element.getStyle('margin-top'))) - 24;
      else if (Position.page(element)[1] <= 0)
        scrollingView.scrollTop = (Position.cumulativeOffset(element)[1] - parseInt(element.getStyle('margin-top'))) - 24;
    }
  },

  // Event Handling ----------------------------------------------------------

  _startObserving: function()
  {
    $L.info("_startObserving", this);

    if (this._isObserving) return;

    // Observe "Key Down" Events
    this._handleKeyDownEventListener = this._handleKeyDownEvent.bindAsEventListener(this);
    document.observe("keydown", this._handleKeyDownEventListener);

    // Observe "Double-Click" Events
    // TODO Only set up this observer if the delegate defines the open delegate or a subclass defines a callback
    this._handleDoubleClickEventListener = this._handleDoubleClickEvent.bindAsEventListener(this);
    this.get("element").observe("dblclick", this._handleDoubleClickEventListener);

    // Observe "Mouse Down" Events
    this._handleMouseDownEventListener = this._handleMouseDownEvent.bindAsEventListener(this);
    this.get("element").observe("mousedown", this._handleMouseDownEventListener);

    // Observe "Mouse Up" Events
    this._handleMouseUpEventListener = this._handleMouseUpEvent.bindAsEventListener(this);
    this.get("element").observe("mouseup", this._handleMouseUpEventListener);

    // Observe "Mouse Move" Events
    this._handleMouseMoveEventListener = this._handleMouseMoveEvent.bindAsEventListener(this);
    this.get("element").observe("mousemove", this._handleMouseMoveEventListener);

    this._isObserving = true;
  },

  _stopObserving: function()
  {
    $L.info("_stopObserving", this);

    if (!this._isObserving) return;

    // Stop Observing "Key Down" Events
    document.stopObserving("keydown", this._handleKeyDownEventListener);
    this._handleKeyDownEventListener = false;

    // Stop Observing "Double-Click" Events
    this.get("element").stopObserving("dblclick", this._handleDoubleClickEventListener);
    this._handleDoubleClickEventListener = false;

    // Stop Observing "Mouse Down" Events
    this.get("element").stopObserving("mousedown", this._handleMouseDownEventListener);
    this._handleMouseDownEventListener = false;

    // Stop Observing "Mouse Up" Events
    this.get("element").stopObserving("mouseup", this._handleMouseUpEventListener);
    this._handleMouseUpEventListener = false;

    // Stop Observing "Mouse Move" Events
    this.get("element").stopObserving("mouseup", this._handleMouseMoveEventListener);
    this._handleMouseMoveEventListener = false;

    this._isObserving = false;
  },

  _handleKeyDownEvent: function(event)
  {
    $L.info("_handleKeyDownEvent", this);

    // Meta/Control
    if (event.metaKey)
    {
      // Shift-A (Select All)
      if (event.keyCode == 97 || event.keyCode == 65)
      {
        this.selectAll();
        event.stop();
        return;
      }
      return;
    }

    // Shift
    else if (event.shiftKey)
    {
      // Left Arrow
      if (event.keyCode == Event.KEY_LEFT || event.keyCode == 63234)
        this.expandSelectionLeft(event);

        // Up Arrow
      if (event.keyCode == Event.KEY_UP || event.keyCode == 63232)
        this.expandSelectionUp(event);

      // Right Arrow
      if (event.keyCode == Event.KEY_RIGHT || event.keyCode == 63235)
        this.expandSelectionRight(event);

      // Down Arrow
      if (event.keyCode == Event.KEY_DOWN || event.keyCode == 63233)
        this.expandSelectionDown(event);

      // Space
      if (event.keyCode == 32)
        event.stop();

      // Tab
      if (event.keyCode == Event.KEY_TAB) 
      {
        if (this.selectedItems.size() > 0)
          this.moveLeft(event);
      }

      return;
    }

    // Enter (Open Item)
    // TODO Only handle this event if the delegate or callback for opening items is defined
    if (event.keyCode == Event.KEY_RETURN)
    {
      if (this.selectedItems.size() == 1)
        this.open(this.selectedItems.first());
    }

    // Delete/Backspace
    // TODO Only handle this event if the delegate or callback for deleting items is defined
    if (event.keyCode == Event.KEY_BACKSPACE || event.keyCode == Event.KEY_DELETE || event.keyCode == 63272)
    {
      this.destroy(this.selectedItems);
      event.stop();
    }

    // Left Arrow
    if (event.keyCode == Event.KEY_LEFT || event.keyCode == 63234)
      this.moveLeft(event);

    // Up Arrow
    if (event.keyCode == Event.KEY_UP || event.keyCode == 63232)
      this.moveUp(event);

    // Right Arrow
    if (event.keyCode == Event.KEY_RIGHT || event.keyCode == 63235)
      this.moveRight(event);

    // Down Arrow
    if (event.keyCode == Event.KEY_DOWN || event.keyCode == 63233)
      this.moveDown(event);

    // Space
    if (event.keyCode == 32)
      event.stop();

    // Tab
    if (event.keyCode == Event.KEY_TAB)
    {
      if (this.selectedItems.size() > 0)
        this.moveRight(event);
    }
  },

  _handleDoubleClickEvent: function(event)
  {
    $L.info("_handleDoubleClickEvent", this);

    var element = event.element();
    if (element.tagName != 'LI') element = element.up('li');
    if (element)
    {
      this.deselectAll();
      this.open(element);
    }
    event.preventDefault();
  },

  _handleMouseDownEvent: function(event)
  {
    $L.info("_handleMouseDownEvent", this);

    var element = event.element();

    // For Safari, since it passes thru clicks on the scrollbar, exclude 15 pixels from the click area
    if (Prototype.Browser.WebKit) {
      if (this.get("element").scrollHeight > this.get("element").getHeight()) {
        if (Event.pointerX(event) > (this.get("element").getWidth() + Position.cumulativeOffset(this.get("element"))[0] - 15)) {
          event.stop();
          return;
        }
      }
    }

    if (element.tagName != 'LI') element = element.up('li');
    if (element)
      this.select(element, event);
    else
      this.deselectAll();

    this._isDragging = true;
    this._originX = event.pointerX();
    this._originY = event.pointerY();
    this.get("selectionOverlayElement").setStyle({
      width: '0px',
      height: '0px',
      left: event.pointerX() - this.element.cumulativeOffset()[0],
      top: event.pointerY() - this.element.cumulativeOffset()[1]
    });

    event.preventDefault();
  },

  _handleMouseUpEvent: function(event)
  {
    this._isDragging = false;
    this.get("selectionOverlayElement").hide();
    this.get("selectionOverlayElement").setStyle({ width:'0px', height:'0px' });
    event.stop();
    if (this.selectHandler != null)
      this.selectHandler(this.selectedItems);
  },

  _handleMouseMoveEvent: function(event)
  {
    if (this._isDragging)
    {
      var overlay = this.get("selectionOverlayElement");

      if (!overlay.visible()) overlay.show();

      var top, left, right, bottom;
      var width  = event.pointerX() - this._originX;
      var height = event.pointerY() - this._originY;

      if (width < 0)
      {
        width = -width;
        left = event.pointerX();
      }
      else
      {
        left = this._originX;
      }

      if (height < 0)
      {
        height = -height;
        top = event.pointerY();
      }
      else
      {
        top = this._originY;
      }

      left = left - this.element.cumulativeOffset()[0];
      top  = top  - this.element.cumulativeOffset()[1];

      overlay.setStyle({
        left: left + 'px',
        top: top + 'px',
        width: width + 'px',
        height: height + 'px'
      })

      this.get("element").select('li').each(function(element) {
        var offset = element.cumulativeOffset();
        var dimensions = element.getDimensions();
        left = offset.left;
        top = offset.top;
        right = left + dimensions.width;
        bottom = top + dimensions.height;
        if (Position.within(overlay, left, top) ||
            Position.within(overlay, right, top) ||
            Position.within(overlay, left, bottom) ||
            Position.within(overlay, right, bottom))
        {
          element.addClassName('selected');
          if (this.selectedItems.indexOf(element) == -1)
            this.selectedItems.push(element);
        }
        else
        {
          this.selectedItems[this.selectedItems.indexOf(element)] = null;
          element.removeClassName('selected');
        }
      }, this);

    }
  },

  // View Callbacks ----------------------------------------------------------

  viewWillAppear: function(animated)
  {
    $L.info("viewWillAppear", this);
  },

  viewDidAppear: function(animated)
  {
    this._startObserving();
    $L.info("viewDidAppear", this);
  },

  viewWillDisappear: function(animated)
  {
    $L.info("viewWillDisappear", this);
    this._stopObserving();
  },

  viewDidDisappear: function(animated)
  {
    $L.info("viewDidDisappear", this);
  }

});
