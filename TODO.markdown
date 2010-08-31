# Aphid To-Do List

## Documentation

 * Add overview documentation on how to start a new project with Aphid that
   covers both initialization scenarios: fully dynamic and asynchronous and
   from a static document.

 * Copy all of the inline TODOs to TODO.markdown.

## Compatibility

 * Ensure compatibility with Internet Explorer 7+.

 * Ensure compatibility with Firefox 3+.

 * Add support for placeholders on block elements to IE and also automatically
   strip out whitespace on elements with the data-placeholder attribute so that
   the CSS rule will be applied on supporting browsers.

## Tools

 * Add an `aphid` command-line tool for starting new Aphid projects or for
   applying Aphid to a Rails or other type of project.

 * Add a rake task for creating gem packages of Aphid (that would include the
   `aphid` command for easy project setup).

 * Add a rake task for creating release packages of Aphid.

## Library

### General

 * Formally define and implement the concepts of class options (i.e.
   ListView#options = { isSortable: ... } instead of ListView#isSortable),
   public (ListView#items) and private (ListView#_itemElements) properties.

 * Add get/set methods on Object for getting and setting properties (i.e.
   ListView.get("items")) so that we can optionally intercept and/or perform
   actions when properties are requested (or set). This may require us to
   assign public properties to the class _properties property.

 * Formally define mixins for delegate protocols (i.e. Aphid.UI.View.DelegateMethods).

### Aphid.Model

 * Add support for pluggable backends (i.e. Node.js, Rails, etc) since each
   service may need to serialize and save differently.

 * Add more callbacks and delegates to the workflow (i.e. beforeSave,
   beforeLoad, afterInitiaze, beforeInitialize, etc).

### Aphid.Support.Logger

 * Make the Logger accept an object as the optional second parameter and
   implement a protocol that Aphid classes should respond to identify(), which
   will return an identification string for the message that was logged (i.e.
   "[Aphid.UI.SplitViewController - MySplitViewController] _Log Message_").

### Aphid.UI.Window

 * Add documentation and tests for Aphid.UI.Window.

### Aphid.UI.View

 * Formalize event handling support by automatically observing views when the
   view subclass defines event handling methods (i.e. MyView#onClick()).

 * Add support for initializing views from outlets with custom templates
   defined as the data-template attribute on the outlet element.

 * Add support for specifying the delegate and dataSource properties for views
   that are initialized by outlet with data-* attributes that will evaluate to
   properties on the view that owns the outlet.

 * Add support for programmatically declaring a View's markup/element.

 * Add Aphid.UI.View#enable() and Aphid.UI.View#disable() for enabling or
   disabling the view by standard conventions.

 * Add support for caching views that are loaded from a template on a class
   level for reuse without re-requesting the template from the server.

 * Improve testing for asynchronous and non-asynchronous loading, including
   proper callback and delegate testing.

### Aphid.UI.ViewController

 * Fix modal view presentation with the new overlay support in Aphid.UI.Window.

### Aphid.UI.ListView

 * When clearing the selection, a callback should be called for subclasses so
   that they can act on the selection change just like the delegate is called
   now.

 * Figure out a good pattern for reusing list view items when reloading data
   instead of recreating each list view item each time that reload data is
   called.

### Aphid.UI.LoadingIndicator

 * Convert to a subclass of Aphid.UI.View.

 * Add tests.

### Aphid.UI.SplitViewController

 * Give SplitViewController its own 2 views: firstView, secondView. Instead of
   assigning these views, we should say splitView.firstView.addSubview or
   splitView.firstView.setView.

 * Clean up and document `Aphid.UI.SplitViewController` and move more of the
   logic from the `Draggable` subclass (`Aphid.UI.SplitViewController.Draggable`)
   into delegates or callbacks on `Aphid.UI.SplitViewController`.

 * Add persistence to the SplitViewController so that the last dimensions are
   always used when the view is reloaded.

 * Allow min-width/max-width to be enforced on the second view. When resizing
   and the max-width or max-height of the first view has not been met but the
   min-width or min-width of the second view has been met, resizing should be
   stopped.

 * Automatically detect vertical or horizontal constraint based on the
   absolute position characteristics (i.e. if both have top: 0 we can assume
   its a vertical split, or if both have left: 0 we can assume its horizontal).

 * Automatically position and size the drag handle based on the following
   formulas:

   * Vertical Split Views: (secondView.left - (firstView.left + firstView.width + (firstView.borderWidth * 2)))
   * Horizontal Split Views: (secondView.top - (firstView.top + firstView.height + (firstView.borderWidth * 2)))

 * Implement double-click support (both with a callback and default behavior
   minimizing the first pane).

### Aphid.UI.TabViewController

 * Add support for switching between content sets. The current implementation
   only registers for events and manages the delegate calls to make the
   delegate aware that the tab view changed, leaving the content switching up
   to the delegate. This class needs to be able to stand on its own.

 * Split `Aphid.UI.TabViewController` into `Aphid.UI.TabView`, for managing tab
   views themselves, and `Aphid.UI.TabViewController` for using a TabView as a
   full view controller.

 * Investigate the possibility of subclassing `Aphid.UI.ListView` for a
   `Aphid.UI.TabView` subclass. A tab view is basically a list that requires
   selection support, which is something that `Aphid.UI.ListView` already does,
   therefore, the two classes are already very similar. Another option would
   be to extract the list selection functionality into a mixin that can be
   included in both classes.

 * Add tests for selection persistence.
