/**
 * class Aphid.UI.MatrixView < Aphid.UI.ListView
 *
 *
**/

//= require <Aphid/UI/MatrixViewItem>

Aphid.UI.MatrixView = Aphid.Class.create("Aphid.UI.MatrixView", Aphid.UI.ListView, {

  /**
   * Aphid.UI.ListView#itemViewClass -> String
   *
   * The default base class
  **/
  itemViewClass: "Aphid.UI.MatrixViewItem",

  /*
   * Aphid.UI.MatrixView#_selectionOverlayElement -> Element | false
   *
   * The semi-translucent overlay element that is displayed above items in the
   * view during a mouse drag-select operation.
   */
  _selectionOverlayElement: false,

  /*
   * Aphid.UI.MatrixView#_originX -> Boolean
   */
  _originX: false,

  /*
   * Aphid.UI.MatrixView#_originY -> Boolean
   */
  _originY: false,

  /*
   * Aphid.UI.MatrixView#_isDragging -> Boolean
   */
  _isDragging: false,

  /**
  * Aphid.UI.MatrixView#dragSelectionEnabled -> Boolean
   *
   * If dragSelectionEnabled is set to true, the list will allow the user to
   * drag select items in the view. This requires multipleSelectionEnabled to
   * be true, as well.
  **/
  dragSelectionEnabled: true,

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
      this._selectionOverlayElement = new Element("div", { className: "selectionOverlay" });
      this._selectionOverlayElement.hide();
      this.get("element").insert({ top: this._selectionOverlayElement });
    }
    return this._selectionOverlayElement;
  },

  // Selection ---------------------------------------------------------------

  /**
   * Aphid.UI.MatrixView#selectItem(item) -> Boolean
   *
   * - item ([[Aphid.UI.ListViewItem]]): the list view item to select
   *
   * Selects the specified list item. Returns true if the item was selected or
   * false if no action was performed.
  **/
  selectItem: function($super, item)
  {
    if (!this._shouldSelectItem(item)) return false;
    this._willSelectItem(item);

    // Get the index of the selected item
    var index = this.get("items").indexOf(item);

    // Clear the previous selection and set the newly selected item, unless
    // multiple selection is enabled.
    if (!this.get("multipleSelectionEnabled"))
    {
      this._clearSelection();
      this.set("selectedItem", item.select());
      this.set("selectedItemIndex", index);
      this.scrollToSelectedItem();
    }
    else
    {
      this.get("selectedItems").push(item.select());
      this.get("selectedItemIndexes").push(index);
    }

    this._didSelectItem(item);

    if (this.get("persistSelectedItem"))
      this._persistSelection();

    return true;
  },

  addItemToSelection: function($super, item)
  {
    alert('add item to selection')
  },

  selectAll: function()
  {
    $L.info("selectAll", this);
    this.clearSelection();
    this.get("element").select("li").each(function(el) {
      el.addClassName('selected');
      this.selectedItems.push(el);
    }, this);
  },

  selectFirst: function()
  {
    $L.info("selectFirst", this);

    var element = this.get("element").down("li");
    if (!element) return;

    var item = element.getStorage().get("item");
    if (this.get("multipleSelectionEnabled"))
      this.clearSelection();
    this.selectItem(item);
  },

  selectLast: function()
  {
    $L.info("selectLast", this);

    var element = this.get("element").select("li").last();
    if (!element) return;

    var item = element.getStorage().get("item");
    if (this.get("multipleSelectionEnabled"))
      this.clearSelection();
    this.selectItem(item);
  },

  _expandSelectionLeft: function(event)
  {
    if (!this.get("multipleSelectionEnabled")) return;

    $L.info("_expandSelectionLeft", this);
    var element = this.element.down('li.selected');
    var otherElement = element.previous();
    otherElement.addClassName('selected');
    this.get("selectedItems").push(otherElement);

    this.scrollToSelectedItem();
  },

  _expandSelectionRight: function(event)
  {
    if (!this.get("multipleSelectionEnabled")) return;

    $L.info("expandSelectionRight", this);

    var element = this.element.getElementsBySelector('li.selected').last();
    var otherElement = element.next();
    otherElement.addClassName('selected');
    this.get("selectedItems").push(otherElement);

    this.scrollToSelectedItem();
  },

  _expandSelectionUp: function(event)
  {
    if (!this.get("multipleSelectionEnabled")) return;

    $L.info("_expandSelectionUp", this);

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
        this.scrollToSelectedItem();
      }
    }, this);
  },

  _expandSelectionDown: function(event)
  {
    if (!this.get("multipleSelectionEnabled")) return;

    $L.info("_expandSelectionDown", this);

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
        this.scrollToSelectedItem();
      }
    }, this);
  },

  // Movement ----------------------------------------------------------------

  moveLeft: function(event)
  {
    $L.debug("moveLeft", this);

    event.stop();

    var element         = this.get("element").down(".selected");
    var previousElement = element ? element.previous() : false;
    if (!element || !previousElement) return this.selectFirst();

    var item = previousElement.getStorage().get("item");
    this.selectItem(item);
  },

  moveRight: function(event)
  {
    $L.debug("moveRight", this);

    event.stop();

    var element = this.get("element").select(".selected").last();
    if (!element) return this.selectFirst();

    var nextElement = element.next();
    if (nextElement)
    {
      var item = nextElement.getStorage().get("item");
      this.selectItem(item);
    }
    else
      this.selectLast();
  },

  moveUp: function(event)
  {
    $L.debug("moveUp", this);

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
          var item = el.getStorage().get("item");
          this.selectItem(item);
        }
      }.bind(this)
    )

  },

  moveDown: function(event)
  {
    $L.debug("moveDown", this);

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
          var item = el.getStorage().get("item");
          this.selectItem(item);
          selected = true;
        }
      }.bind(this)
    )

    if (!selected) this.selectLast();
  },

  // Event Handling ----------------------------------------------------------

  _startObserving: function($super)
  {
    $super();

    // Observe "Key Down" Events
    if (!this._handleKeyDownEventListener)
    {
      this._handleKeyDownEventListener = this.handleKeyDownEvent.bindAsEventListener(this);
      document.observe("keydown", this._handleKeyDownEventListener);
    }
  },

  _stopObserving: function($super)
  {
    $super();

    // Stop Observing "Key Down" Events
    if (this._handleKeyDownEventListener)
    {
      document.stopObserving("keydown", this._handleKeyDownEventListener);
      this._handleKeyDownEventListener = false;
    }
  },

  // TODO Move this to View once it is aware of focus
  handleKeyDownEvent: function(event)
  {
    $L.debug("handleKeyDownEvent", this);

    // Multiple Selection
    if (this.get("multipleSelectionEnabled"))
    {
      // Meta/Control
      if (event.metaKey)
      {
        // Shift-A (Select All)
        if (event.keyCode == 97 || event.keyCode == 65)
        {
          event.stop();
          this.selectAll();
          return;
        }
      }

      // Shift
      else if (event.shiftKey && this.get("multipleSelectionEnabled"))
      {
        // Left Arrow
        if (event.keyCode == Event.KEY_LEFT || event.keyCode == 63234)
          this._expandSelectionLeft(event);

        // Up Arrow
        if (event.keyCode == Event.KEY_UP || event.keyCode == 63232)
          this._expandSelectionUp(event);

        // Right Arrow
        if (event.keyCode == Event.KEY_RIGHT || event.keyCode == 63235)
          this._expandSelectionRight(event);

        // Down Arrow
        if (event.keyCode == Event.KEY_DOWN || event.keyCode == 63233)
          this._expandSelectionDown(event);

        // Space
        if (event.keyCode == 32)
          event.stop();

        // Tab
        if (event.keyCode == Event.KEY_TAB) 
        {
          if (this.selectedItems.size() > 0)
            this.moveLeft(event);
        }
      }

      return;
    }

    // Enter (Open Item)
    if (event.keyCode == Event.KEY_RETURN)
    {
      if (this.selectedItems.size() == 1)
        this.openItem(this.selectedItems.first());
    }

    // Delete/Backspace
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

  handleMouseDownEvent: function(event)
  {
    $L.debug("handleMouseDownEvent", this);

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

    // if (element.tagName != 'LI') element = element.up('li');
    // if (element)
    //   this.selectItem(element, event);
    // else
    //   this.clearSelection();

    // Start Drag-Select Operation (if allowed)
    if (this.get("multipleSelectionEnabled") && this.get("dragSelectionEnabled"))
    {
      this._isDragging = true;
      this._originX = event.pointerX();
      this._originY = event.pointerY();
      this.get("selectionOverlayElement").setStyle({
        width: '0px',
        height: '0px',
        left: event.pointerX() - this.element.cumulativeOffset()[0],
        top: event.pointerY() - this.element.cumulativeOffset()[1]
      });
    }

    // event.preventDefault();
  },

  handleMouseUpEvent: function(event)
  {
    $L.debug("handleMouseUpEvent", this);

    this._isDragging = false;
    this.get("selectionOverlayElement").hide();
    this.get("selectionOverlayElement").setStyle({ width:'0px', height:'0px' });
    event.stop();
  },

  handleMouseMoveEvent: function(event)
  {
    if (!this._isDragging) return;

    $L.info("handleMouseMoveEvent", this);

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
  },

  // View Callbacks ----------------------------------------------------------

  viewWillAppear: function()
  {
    if (this.get("selectedItem"))
      this.scrollToSelectedItem();
  }

});
