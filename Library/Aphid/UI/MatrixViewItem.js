/**
 * class Aphid.UI.MatrixViewItem < Aphid.UI.View
 *
 * List view items belonging to instances of [[Aphid.UI.MatrixView]] are
 * required to be instances of this class, [[Aphid.UI.MatrixViewItem]].
**/

Aphid.UI.MatrixViewItem = Aphid.Class.create("Aphid.UI.MatrixViewItem", Aphid.UI.ListViewItem, {

  /**
   * Aphid.UI.MatrixViewItem#isSelected -> Boolean
   *
   * Denotes the selected state of the matrix view item.
  **/
  isSelected: false,

  /**
   * Aphid.UI.MatrixViewItem#matrixView -> Aphid.UI.MatrixView
   *
   * The [[Aphid.UI.ListView]] instance that this item belongs to.
  **/
  matrixView: false,

  // Initialization ----------------------------------------------------------

  /**
   * new Aphid.UI.MatrixViewItem([options])
   *
   * - options (Hash): Initial property values to be set on the MatrixViewItem
   *   instance
   *
   * Initializes a new MatrixViewItem instance.
  **/
  initialize: function($super, options)
  {
    $super(options);
  },

  // -------------------------------------------------------------------------

  /**
   * Aphid.UI.MatrixViewItem#select() -> Aphid.UI.MatrixViewItem
   *
   * Selects the matrix view item by adding the `selected` CSS class to the
   * element and setting [[Aphid.UI.MatrixViewItem#isSelected]] to `true`.
   * This method returns the matrix view item instance.
  **/
  select: function()
  {
    $L.debug("Selected...", this);
    this.get("element").addClassName('selected');
    this.set("isSelected", true);
    return this;
  },

  /**
   * Aphid.UI.MatrixViewItem#deselect() -> Aphid.UI.MatrixViewItem
   *
   * Deselects the matrix view item by removing the `selected` CSS class from
   * the element and setting [[Aphid.UI.MatrixViewItem#isSelected]] to
   * `false`. This method returns the matrix view item instance.
  **/
  deselect: function()
  {
    $L.debug("Deselected...", this);
    this.get("element").removeClassName('selected');
    this.set("isSelected", false);
    return this;
  },

  handleMouseDownEvent: function(event)
  {
    var listView                 = this.get("listView"),
        multipleSelectionEnabled = listView.get("multipleSelectionEnabled");

    event.stop();

    // if (listView.get("multipleSelectionEnabled") && this.get("isSelected"))
    //   listView.deselectItem(this);
    // else
    //   listView.selectItem(this);

    // Multiple Selection
    if (multipleSelectionEnabled)
    {
      // Multiple Selection (Shift-Select)
      if (event.shiftKey)
      {
        
        if (this.get("isSelected"))
          listView.deselectItem(this);
        else
          listView.addItemToSelection(this);

        // Find first selected item
        var firstSelectedElement      = this.get("element").down("li.selected");
        var firstSelectedElementIndex = this.get("items").indexOf(firstSelectedElement);
        var selectedElementIndex      = this.get("items").indexOf(element);

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
            el.addClassName('selected');
            this.get("selectedItems").push(el);
          }
          if (element == el) done = true;
        }, this);

        return;
      }

      // Multiple Selection (Meta-Select)
      else if (event.metaKey && this.get("multipleSelectionEnabled"))
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

        return;
      }
    }
    else
    {
      listView.selectItem(this);
    }

  }

});

// Method Name Mappings for Debugging ----------------------------------------

Aphid.UI.MatrixViewItem.prototype.select.displayName = "Aphid.UI.MatrixViewItem.select";
Aphid.UI.MatrixViewItem.prototype.deselect.displayName = "Aphid.UI.MatrixViewItem.deselect";
