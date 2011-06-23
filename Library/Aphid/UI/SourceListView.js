/**
 * class Aphid.UI.SourceListView < Aphid.UI.ListView
 *
 * Manages an HTML unordered list by providing support for selection of the
 * items contained within the list.
 *
 * # Usage
 *
 * To initialize an instance of [[Aphid.UI.ListView]], you must specify the
 * `data-view-class` attribute on an HTML unordered list element. The value
 * of this attribute should be either [[Aphid.UI.ListView]], for a standard
 * list, or the name of your [[Aphid.UI.ListView]] subclass. For example:
 *
 *     <ul data-outlet="sourceListView" data-view-class="Aphid.UI.SourceListView">
 *       <li data-badge="5">
 *         <div class="iconView" data-outlet="iconView"><img src="Icons/Inbox.png" /></div>
 *         <div class="contentView" data-outlet="contentView">Inbox</div>
 *       </li>
 *       <li>
 *         <div class="iconView" data-outlet="iconView"><img src="Icons/Sent.png" /></div>
 *         <div class="contentView" data-outlet="contentView">Sent Messages</div>
 *       </li>
 *       <li>
 *         <div class="iconView" data-outlet="iconView"><img src="Icons/Trash.png" /></div>
 *         <div class="contentView" data-outlet="contentView">Trash</div>
 *       </li>
 *     </ul>
 *
 * #### Data Source Methods
 *
 *  * `listViewItemCount(listView)` - Should return the number of items
 *    contained within the list view.
 *
 *  * `listViewItemForIndex(listView, index)` - Should return the item to be
 *    displayed at the given index.
 *
 * #### Delegate Methods
 *
 *  * `listViewShouldSelectItem(listView, item)` - Called just before the item
 *    selection process begins. Returning false will prevent the selection
 *    from happening.
 *
 *  * `listViewShouldDeselectItem(listView, item)` - Called just before the
 *    item deselection process begins. Returning false will prevent the
 *    deselection from happening.
 *
 *  * `listViewSelectionDidChange(listView, item)` - Called when the current
 *    selection has changed.
 *
 *  * `listViewShouldClearSelection(listView)` - Called just before the list
 *    selection clearing process begins. Returning false will prevent the
 *    list selection from being cleared.
 *
 *  * `listViewShouldOpenItem(listView, item)` - Called just before the
 *    item opening process begins. Returning false will prevent the item from
 *    being opened.
 *
 *  * `listViewDidOpenItem(listView, openedItem)` - Called when the user has
 *    requested to open an item, usually by double-clicking on the item.
 *
 *  * `listViewOrderDidChange(listView)` - Called when the sort order has
 *    changed, but not necessarily before the user has finished dragging the
 *    item to its final position.
 *
 *  * `listViewOrderDidUpdate(listView)` - Called after the user
 *    has finished dragging.
 *
 * #### Subclassing Notes
 *
 * If you wish to subclass [[Aphid.UI.ListView]] instead of wrapping an
 * instance and implementing the delegate pattern, you may also override the
 * following methods:
 *
 *  * `shouldSelectItem(item)` - Called just before the item selection process
 *    begins. Returning false will prevent the item from being selected.
 *
 *  * `didSelectItem(item)` - Called when the specified item has been
 *    selected.
 *
 *  * `shouldDeselectItem(item)` - Called just before the item deselection
 *    process begins. Returning false will prevent the item from being
 *    deselected.
 *
 *  * `didDeselectItem(item)` - Called when the specified item has been
 *    deselected.
 *
 *  * `shouldClearSelection()` - Called just before the list selection
 *    clearing process begins. Returning false will prevent the list selection
 *    from being cleared.
 *
 *  * `shouldOpenItem(item)` - Called just before the item opening process
 *    begins. Returning false will prevent the item from being opened.
 *
 *  * `didOpenItem(item)` - Called when the specifeid item has been opened.
 *
**/

Aphid.UI.SourceListView = Aphid.Class.create("Aphid.UI.SourceListView", Aphid.UI.ListView, {

});
