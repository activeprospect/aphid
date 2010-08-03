
# Aphid Release History

## Version 0.9.1 - *Not Yet Released*

 * Added support for placeholder items in ListViews. ListViews that are
   initialized with a list item that has the CSS class of "placeholder" will
   be ignored by the ListView, as if the list contained no items.

 * Added support for URL templates in Aphid.Model class definitions so that
   the record identifier can be placed anywhere in the URL, not just at the
   end.

 * Added support for proxies on attributes that contain an array of objects
   that should be instantiated with the configured proxy class.

 * Added a new abstract class for models, Aphid.Model.

 * Added multiple selection support to Aphid.UI.ListView. This includes the following changes:

   * Added multipleSelectionEnabled property with a default value of false.
   * Renamed isSortable property to sortingEnabled, for consistency.
   * Added selectedItems property, which is used in place of selectedItem, when multiple selection is enabled.
   * Added deselectItem(item) method for deselecting individual items when multiple selection is enabled.
   * Added support for calling listViewShouldDeselectItem and listViewShouldOpenItem on delegates of Aphid.UI.ListView.
   * Added support for calling shouldDeselectItem and shouldOpenItem on subclasses of Aphid.UI.ListView.
   * Other miscellaneous bug fixes and documentation tweaks.

## Version 0.9.0 - July 21st, 2010

  * Initial release.
