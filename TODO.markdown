# Aphid To-Do List

## Packaging

## Documentation

 * Add overview documentation on how to start a new project with Aphid that
   covers both initialization scenarios: fully dynamic and asynchronous and
   from a static document.

 * Copy all of the inline TODOs to TODO.markdown.

## Compatibility

 * Add support for placeholders on block elements to IE and also automatically
   strip out whitespace on elements with the data-placeholder attribute so that
   the CSS rule will be applied on supporting browsers.

 * Add support for loading IE-specific CSS overrides via JavaScript so that
   we no longer require the use of IE comment conditionals.

## Tools

 * Generating new Aphid applications with the "aphid new" command should
   support vendorizing Aphid as a git submodule. This should initialize the
   new application with git and add the submodule automatically.

 * Move from unittest.js to Evidence.js for testing Aphid (see
   https://github.com/tobie/Evidence/blob/master/dist/evidence.js and
   http://www.slideshare.net/tobielangel/unittesting-javascript-with-evidence
   for more information).

## Library

### General

 * Formally define and implement the concepts of class options (i.e.
   ListView#options = { isSortable: ... } instead of ListView#isSortable),
   public (ListView#items) and private (ListView#_itemElements) properties.

 * Formally define mixins for delegate protocols (i.e. Aphid.UI.View.DelegateMethods).

 * Possibly introduce the concept of Layout controllers (examples might
   included TabbedLayoutController, ToolbarLayoutController, etc).

### Aphid.Model

 * Add support for pluggable backends (i.e. Node.js, Rails, etc) since each
   service may need to serialize and save differently.

 * Add more callbacks and delegates to the workflow (i.e. beforeSave,
   beforeLoad, afterInitialize, beforeInitialize, etc).

 * Add proper relationship support and clarify the meaning of a proxy versus
   a relationship.

 * Document and test the hash syntax for proxied attribute values.

### Aphid.Support.Logger

### Aphid.Support.Properties

 * Add support for calling setters for property values that are defined
   directly on a class (i.e. "constrained: true" in a SplitViewController
   subclass).

 * Formalize support for persisting class properties. You should be able to
   mark certain properties as persist-able and calling persistProperties() or
   some other method signature should persist those properties to the session.

### Aphid.UI.ListView

 * When clearing the selection, a callback should be called for subclasses so
   that they can act on the selection change just like the delegate is called
   now.

 * Figure out a good pattern for reusing list view items when reloading data
   instead of recreating each list view item each time that reload data is
   called.

 * Honor selection state when initializing from HTML.

 * Add tests for sorting behavior.

 * Implement (fix) support for scrolling list views when dragging list view
   items to the edge of the container when overflow is in use. There are a lot
   of problems with this in current script.aculo.us, including incompatibility
   with Prototype 1.7 and issues with the dragged item not respecting the
   scroll offset when being scrolled.

### Aphid.UI.LoadingIndicator

 * Convert to a subclass of Aphid.UI.View.

 * Add tests.

 * Add support for a CSS-based animation for browsers that support it.

 * Allow multiple loading indicator instances so that we can show one on each
   view that is initializing.

### Aphid.UI.MatrixView

 * Implement MatrixViewItem for managing each item within a MatrixView
   instance, much like ListViewItems are handled by ListView instances.

 * Change to using a focus model.

 * Add an option for toggling multiple selection (and drag selection) support
   on or off.

 * Drag selection needs to honor the scrolling offset of its containing view.

### Aphid.UI.SplitViewController

 * Add support for setting the split view style (standard, padded or
   borderless) and document how to add new styles.

 * Give SplitViewController its own 2 views: firstView, secondView. Instead of
   assigning these views, we should say splitView.firstView.addSubview or
   splitView.firstView.setView.

 * Allow min-width/max-width to be enforced on the second view. When resizing
   and the max-width or max-height of the first view has not been met but the
   min-width or min-width of the second view has been met, resizing should be
   stopped.

 * Automatically position and size the drag handle based on the following
   formulas:

   * Vertical Split Views: (secondView.left - (firstView.left + firstView.width + (firstView.borderWidth * 2)))
   * Horizontal Split Views: (secondView.top - (firstView.top + firstView.height + (firstView.borderWidth * 2)))

 * Implement double-click support (both with a callback and default behavior
   minimizing the first pane).

 * Add resizing support to Internet Explorer 7 thru 9.

 * Fix the problem where resizing a split view in borderless mode will add the
   width of the dragHandle to the secondView.

 * Investigate the possibility of subclassing `Aphid.UI.ListView` for a
   `Aphid.UI.TabView` subclass. A tab view is basically a list that requires
   selection support, which is something that `Aphid.UI.ListView` already does,
   therefore, the two classes are already very similar. Another option would
   be to extract the list selection functionality into a mixin that can be
   included in both classes.

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

### Aphid.UI.Controls.SelectView

 * Add support for Internet Explorer 7.

 * Ensure that we are observing for change events on the original SELECT
   element.

 * Need to validate the element before initializing to make sure it is a
   <select> and multiple="false".

 * Add support for detecting the "nearest" letter during type-ahead find.

 * Add support for matching more than just the first letter if typed in
   succession within a buffer timeout interval.

 * Finish writing documentation for the SelectView control.

 * Add tests for the SelectView control.

### Aphid.UI.View

 * Formalize event handling support by automatically observing views when the
   view subclass defines event handling methods (i.e. MyView#onClick()).

 * Add support for initializing views from outlets with custom templates
   defined as the data-template attribute on the outlet element.

 * Add support for specifying the delegate and dataSource properties for views
   that are initialized by outlet with data-* attributes that will evaluate to
   properties on the view that owns the outlet.

 * Add support for caching views that are loaded from a template on a class
   level for reuse without re-requesting the template from the server.

 * Improve testing for asynchronous and non-asynchronous loading, including
   proper callback and delegate testing.

 * Come up with a universal way to initialize new views from data-view-class,
   instead of having various implementations throughout the view stack (such
   as in Aphid.UI.ListView).

 * Replace _setupView with setElement.

### Aphid.UI.ViewController

 * Fix modal view presentation with the new overlay support in Aphid.UI.Window.

### Aphid.UI.Window
