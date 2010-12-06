/**
 * class Aphid.UI.MatrixViewItem < Aphid.UI.View
 *
 * List view items belonging to instances of [[Aphid.UI.MatrixView]] are
 * required to be instances of this class, [[Aphid.UI.MatrixViewItem]].
**/

Aphid.UI.MatrixViewItem = Class.create(Aphid.UI.View, {

  displayName: "Aphid.UI.MatrixViewItem",

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
    if (!this.get("element"))
    {
      $L.debug("Initializing default element...", this);
      this.set("element", new Element('li').addClassName("MatrixViewItem"));
      this.set("isLoaded", true);
    }
  },

  viewDidLoad: function($super)
  {
    this.get("element").addClassName("MatrixViewItem");
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
  }

});

// Method Name Mappings for Debugging ----------------------------------------

Aphid.UI.MatrixViewItem.prototype.select.displayName = "Aphid.UI.MatrixViewItem.select";
Aphid.UI.MatrixViewItem.prototype.deselect.displayName = "Aphid.UI.MatrixViewItem.deselect";
