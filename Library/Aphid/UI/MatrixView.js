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
  selectItem: function(element, event)
  {
    // Ensure that we can select the item...
    if (!this._shouldSelectItem(element))
      return false;

    $L.info("selectItem", this);

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
        this.selectItem(element);
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
      // TODO Should this be clearSelection?
      this.get("element").select(".selected").invoke("removeClassName", "selected");
      this.selectedItems = $A(element);
      element.addClassName("selected");
    }

    this._didSelectItem(element);
  },

  selectAll: function()
  {
    $L.info("selectAll", this);
    this.clearSelection();
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

    this.clearSelection();
    this.selectItem(element);

    this.scrollIntoView(element, 'down');

    // If a custom select handler has been defined, call it
    if (this.selectHandler != null)
      this.selectHandler(element);
  },

  selectLast: function()
  {
    $L.info("selectLast", this);

    var element = this.get("element").select("li").last();

    this.clearSelection();
    this.selectItem(element);

    this.scrollIntoView(element, 'down');

    // If a custom select handler has been defined, call it
    if (this.selectHandler != null)
      this.selectHandler(element);
  },

  clearSelection: function()
  {
    if (!this._shouldClearSelection())
      return;

    $L.info("clearSelection", this);

    this.get("element").select('.selected').invoke("removeClassName", "selected");
    this.set("selectedItems", $A());

    this._didClearSelection();
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

  /**
   * Aphid.UI.MatrixView#openItem(item) -> null
   *
   * - item ([[Aphid.UI.ListViewItem]]): the matrix view item to be opened
   *
   * Instructs the delegate or subclass that the specified item should be
   * opened or otherwise acted upon. This functionality is implemented by the
   * subclass or delegate and has no behavior by default.
  **/
  openItem: function(item)
  {
    // Ensure that we can open the item...
    if (!this._shouldOpenItem(item))
      return;

    $L.info("openItem", this);

    this.clearSelection();
    item.addClassName('selected');

    this._didOpenItem(item);
  },

  // TODO removeItems
  removeItem: function(item)
  {
    if (!this._shouldRemoveItem(item))
      return;

    $L.info("removeItem", this);

    this._didRemoveItem(item);
  },

  // Movement ----------------------------------------------------------------

  moveLeft: function(event)
  {
    $L.info("moveLeft", this);

    event.stop();

    var element         = this.get("element").down(".selected");
    var previousElement = element ? element.previous() : false;
    if (!element || !previousElement) return this.selectFirst();

    this.selectItem(previousElement);
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
      this.selectItem(nextElement);
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
          this.selectItem(el);
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
          this.selectItem(el);
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
        this.openItem(this.selectedItems.first());
    }

    // Delete/Backspace
    // TODO Only handle this event if the delegate or callback for deleting items is defined
    if (event.keyCode == Event.KEY_BACKSPACE || event.keyCode == Event.KEY_DELETE || event.keyCode == 63272)
    {
      this.selectedItems.each(function(item) {
        this.removeItem(item);
      }, this);
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
      this.clearSelection();
      this.openItem(element);
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
      this.selectItem(element, event);
    else
      this.clearSelection();

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
  },

  // Callbacks ---------------------------------------------------------------

  /*
   * Aphid.UI.MatrixView#_shouldSelectItem(item) -> Boolean
   *
   * Checks for basic conditions that should prevent item selection from
   * occurring, such as the item already being selected. It also evaluates the
   * `shouldSelectItem` callback and the `matrixViewShouldSelectItem` delegate
   * method before returning *true* or *false*.
   *
   * Delegates have the final say in whether or not the item should be
   * selected.
   */
  _shouldSelectItem: function(item)
  {
    var shouldSelect = true;
    if (this.shouldSelectItem)
      shouldSelect = this.shouldSelectItem(item);
    if (this.delegate && this.delegate.matrixViewShouldSelectItem)
      shouldSelect = this.delegate.matrixViewShouldSelectItem(this, item);
    return shouldSelect;
  },

  /*
   * Aphid.UI.MatrixView#_didSelectItem(item) -> null
   *
   * Performs any internal actions after an item has been selected before
   * calling the `didSelectItem` callback and the two delegate methods:
   * `matrixViewSelectionDidChange` and `matrixViewDidSelectItem`.
   */
  _didSelectItem: function(item)
  {
    // Call the public callback, that may have been implemented by a subclass.
    if (this.didSelectItem)
      this.didSelectItem(item);

    // Call the matrixViewSelectionDidChange method on the delegate, if the
    // delegate has defined it.
    if (this.delegate && this.delegate.matrixViewSelectionDidChange)
      this.delegate.matrixViewSelectionDidChange(this);

    // Call the matrixViewDidSelectItem method on the delegate, if the
    // delegate has defined it.
    if (this.delegate && this.delegate.matrixViewDidSelectItem)
      this.delegate.matrixViewDidSelectItem(this, item);
  },

  /*
   * Aphid.UI.MatrixView#_shouldDeselectItem(item) -> Boolean
   *
   * Checks for basic conditions that should prevent item deselection from
   * occurring, such as the item not being selected. It also evaluates the
   * `shouldDeselectItem` callback and the `martrixViewShouldDeselectItem`
   * delegate method before returning *true* or *false*.
   *
   * Delegates have the final say in whether or not the item should be
   * deselected.
   */
  _shouldDeselectItem: function(item)
  {
    var shouldDeselect = true;
    if (this.shouldDeselectItem)
      shouldDeselect = this.shouldDeselectItem(item);
    if (this.delegate && this.delegate.matrixViewShouldDeselectItem)
      shouldDeselect = this.delegate.matrixViewShouldDeselectItem(this, item);
    return shouldDeselect;
  },

  /*
   * Aphid.UI.MatrixView#_didDeselectItem(item) -> null
   *
   * Performs any internal actions after an item has been deselected before
   * calling the `didDeselectItem` callback and the two delegate methods:
   * `matrixViewSelectionDidChange` and `matrixViewDidDeselectItem`.
   */
  _didDeselectItem: function(item)
  {
    // Call the public callback, that may have been implemented by a subclass.
    if (this.didDeselectItem)
      this.didDeselectItem(item);

    // Call the matrixViewSelectionDidChange method on the delegate, if the
    // delegate has defined it.
    if (this.delegate && this.delegate.matrixViewSelectionDidChange)
      this.delegate.matrixViewSelectionDidChange(this);

    // Call the matrixViewSelectionDidChange method on the delegate, if the
    // delegate has defined it.
    if (this.delegate && this.delegate.matrixViewDidDeselectItem)
      this.delegate.matrixViewDidDeselectItem(this, item);
  },

  /*
   * Aphid.UI.ListView#_shouldClearSelection(item) -> Boolean
   *
   * Checks for basic conditions that should prevent the selection from being
   * cleared, such as when no items are currently selected. It also evaluates
   * the `shouldClearSelection` callback and the `matrixViewShouldClearSelection`
   * delegate method before returning *true* or *false*.
   *
   * Delegates have the final say in whether or not the list selection should
   * be cleared.
   */
  _shouldClearSelection: function()
  {
    var shouldClearSelection = true;
    if (this.shouldClearSelection)
      shouldClearSelection = this.shouldClearSelection();
    if (this.delegate && this.delegate.matrixViewShouldClearSelection)
      shouldClearSelection = this.delegate.matrixViewShouldClearSelection(this);
    return shouldClearSelection;
  },

  /*
   * Aphid.UI.MatrixView#_didClearSelection(item) -> null
   *
   * Performs any internal actions after an item has been deselected before
   * calling the `didClearSelection` callback and the two delegate methods:
   * `matrixViewSelectionDidChange` and `matrixViewDidClearSelection`.
   */
  _didClearSelection: function()
  {
    // Call the public callback, that may have been implemented by a subclass.
    if (this.didDeselectItem)
      this.didDeselectItem(item);

    // Call the matrixViewSelectionDidChange method on the delegate, if the
    // delegate has defined it.
    if (this.delegate && this.delegate.matrixViewSelectionDidChange)
      this.delegate.matrixViewSelectionDidChange(this);

    // Call the matrixViewDidClearSelection method on the delegate, if the
    // delegate has defined it.
    if (this.delegate && this.delegate.matrixViewDidClearSelection)
      this.delegate.matrixViewDidClearSelection(this);
  },

  /*
   * Aphid.UI.MatrixView#_shouldOpenItem(item) -> Boolean
   *
   * Checks with the subclass and delegate to see if the item should be
   * opened.
   *
   * Delegates have the final say in whether or not the item should be
   * opened.
   */
  _shouldOpenItem: function(item)
  {
    var shouldOpen = true;
    if (this.shouldOpenItem)
      shouldOpen = this.shouldOpenItem(item);
    if (this.delegate && this.delegate.matrixViewShouldOpenItem)
      shouldOpen = this.delegate.matrixViewShouldOpenItem(this, item);
    return shouldOpen;
  },

  /*
   * Aphid.UI.MatrixView#_didOpenItem(item) -> null
   *
   * Performs any internal actions after an item has been opened before
   * calling the `didOpenItem` callback and the `matrixViewViewDidOpenItem`
   * delegate method.
   */
  _didOpenItem: function(item)
  {
    // Call the public callback, that may have been implemented by a subclass.
    if (this.didOpenItem)
      this.didOpenItem(item);

    // Call the matrixViewDidOpenItem method on the delegate, if the delegate
    // has defined it.
    if (this.delegate && this.delegate.matrixViewDidOpenItem)
      this.delegate.matrixViewDidOpenItem(this, item);
  },


  /*
   * Aphid.UI.MatrixView#_shouldRemoveItem(item) -> Boolean
   *
   * Checks with the subclass and delegate to see if the item should be
   * removed.
   *
   * Delegates have the final say in whether or not the item should be
   * removed.
   */
  _shouldRemoveItem: function(item)
  {
    var shouldRemove = true;
    if (this.shouldRemoveItem)
      shouldRemove = this.shouldRemoveItem(item);
    if (this.delegate && this.delegate.matrixViewShouldRemoveItem)
      shouldRemove = this.delegate.matrixViewShouldRemoveItem(this, item);
    return shouldRemove;
  },

  /*
   * Aphid.UI.MatrixView#_didRemoveItem(item) -> null
   *
   * Performs any internal actions after an item has been removed before
   * calling the `didRemoveItem` callback and the
   * `matrixViewViewDidRemoveItem` delegate method.
   */
  _didRemoveItem: function(item)
  {
    // Call the public callback, that may have been implemented by a subclass.
    if (this.didRemoveItem)
      this.didRemoveItem(item);

    // Call the matrixViewDidRemoveItem method on the delegate, if the delegate
    // has defined it.
    if (this.delegate && this.delegate.matrixViewDidRemoveItem)
      this.delegate.matrixViewDidRemoveItem(this, item);
  }


});
