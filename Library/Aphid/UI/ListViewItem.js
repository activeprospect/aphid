/**
 * class Aphid.UI.ListViewItem < Aphid.UI.View
 *
**/

Aphid.UI.ListViewItem = Class.create(Aphid.UI.View, {

  displayName: "ListViewItem",

  /**
   * Aphid.UI.ListViewItem#isSelected -> Boolean
  **/
  isSelected: false,

  /**
   * Aphid.UI.ListViewItem#listView -> Aphid.UI.ListView
   *
   * The ListView instance that this item belongs to.
  **/
  listView: false,

  // Initialization ----------------------------------------------------------

  /**
   * new Aphid.UI.ListViewItem([options])
   *
   * - options (Hash): Initial property values to be set on the View instance
   *
   * Initializes a new View instance.
  **/
  initialize: function($super, options)
  {
    $super(options);
    if (!this.element)
    {
      $L.info("Initializing default element...", this.displayName)
      this.element = new Element('li');
      this.isLoaded = true;
    }
  },

  viewDidLoad: function($super)
  {
    $super();
  },

  // -------------------------------------------------------------------------

  select: function()
  {
    $L.debug("Selected...", "Aphid.UI.ListViewItem");
    this.element.addClassName('selected');
    this.isSelected = true;
    return this;
  },

  deselect: function()
  {
    $L.debug("Deselected...", "Aphid.UI.ListViewItem");
    this.element.removeClassName('selected');
    this.isSelected = false;
    return this;
  }

});

// Method Name Mappings for Debugging ----------------------------------------

Aphid.UI.ListViewItem.prototype.select.displayName = "Aphid.UI.ListViewItem.select";
Aphid.UI.ListViewItem.prototype.deselect.displayName = "Aphid.UI.ListViewItem.deselect";
