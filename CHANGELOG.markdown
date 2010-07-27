
# Aphid Release History

## Version 0.9.1 - *Not Yet Released*

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
