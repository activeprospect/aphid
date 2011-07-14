/**
 * class Aphid.UI.TabViewController < Aphid.UI.ViewController
 *
 * By default, controllers that inherit from Aphid.UI.TabViewController are
 * intended to handle the full-screen navigation.
 *
 * #### Example View Template
 *
 *     <section id="myTabView">
 *       <header>
 *         <h1>My Application</h1>
 *         <ul class="tabs">
 *           <li data-tab="home" data-view="homeView" data-content-view-class="HomeViewController">
 *             Home
 *           </li>
 *           <li data-tab="products" data-view="productsView" data-content-view-class="ProductsController">
 *             Products
 *           </li>
 *           <li data-tab="contact" data-view="contactView" data-content-view-class="ContactViewController">
 *             Contact Us
 *           </li>
 *         </ul>
 *       </header>
 *       <section id="contentView" data-outlet="contentView">
 *         <!-- Tab View Contents -->
 *       </section>
 *     </section>
 * 
 * #### Delegate Methods
 *
 *  * `tabViewShouldSelectTab(tabView, tab)` - Called just before the tab
 *    selection process begins. Returning false will prevent the tab from
 *    being selected.
 *
 *  * `tabViewSelectionDidChange(tabView, selectedTab)` - Called when the
 *    current tab selection has changed.
 *
 * #### Subclassing Notes
 *
 * If you wish to subclass [[Aphid.UI.TabViewController]] instead of wrapping
 * an instance and implementing the delegate pattern, you may also override
 * the following methods:
 *
 *  * `shouldSelectTab(tab)` - Called just before the tab selection process
 *    begins. Returning false will prevent the tab from being selected.
 *
 *  * `didSelectTab(tab)` - Called when the current tab selection has changed.
 *
**/

Aphid.UI.TabViewController = Aphid.Class.create("Aphid.UI.TabViewController", Aphid.UI.ViewController, {

  /**
   * Aphid.UI.TabViewController#persistSelectedTab -> Boolean
   *
   * If persistSelectedTab is *true* the selected tab will be persisted as a
   * cookie and the persisted selection will be re-applied on page reloads.
   * The default value is *false*.
  **/
  persistSelectedTab: false,

  /**
   * Aphid.UI.TabViewController#tabs -> Array | false
   *
   * An array of the tabs being managed by this controller.
  **/
  tabs: false,

  /**
   * Aphid.UI.TabViewController#defaultTab -> Element | String | false
   *
   * An element reference or a string reference to a data-tab attribute value
   * that identifies the default tab.
  **/
  defaultTab: false,

  /**
   * Aphid.UI.TabViewController#selectedTab -> Element | false
   *
   * The currently selected tab item, or false if no item is currently
   * selected.
  **/
  selectedTab: false,

  /*
   * Aphid.UI.TabViewController#contentView -> Element | false
   *
   * TODO ...
   */
  contentView: false,

  // Initialization ----------------------------------------------------------

  viewDidLoad: function($super)
  {
    $super();

    var tabElements = this.get("element").select('ul.tabs li');
    this.set("tabs", tabElements);

    // Select Persisted Tab...
    if (this.persistSelectedTab)
    {
      var selectedTab = $C.get(this.displayName + '.selectedTab');
      if (selectedTab)
      {
        $L.info('Restoring previously selected tab "' + selectedTab + '"', this);
        this.selectTab(selectedTab, false);
        return;
      }
    }

    // ... or Default Tab
    $L.info('Selecting default tab "' + this.get("defaultTab") + '"', this);
    this.selectDefaultTab(false);
  },

  // Tab Selection -----------------------------------------------------------

  /**
   * Aphid.UI.TabViewController#selectTab(tab[, animated = true]) -> null
   *
   * - tab (Element | String): the element of the tab that should be selected
   *   or the name of the tab, as specified in the tab's data-tab attribute.
   * - animated (Boolean): specifies whether or not the tab should be switched
   *   with animation (defaults to true).
   *
   * Selects the specified *tab*.
  **/
  selectTab: function(tab, animated)
  {
    if (Object.isUndefined(animated)) animated = false;

    // Allow selectTab to be called with an Event or an Element
    if (!Object.isElement(tab))
    {
      if (Object.isString(tab))
      {
        var tabName = tab;
        tab = this._findTabByName(tabName);
        if (Object.isUndefined(tab))
        {
          $L.warn('Tried to select a tab (' + tabName + ') that could not be found in the template', this);
          return;
        }
      }
    }

    // Check with shouldSelectTab to be sure that we are in a state that will
    // allow for its selection...
    if (!this._shouldSelectTab(tab))
      return;

    // Select the Tab
    this.get("tabs").invoke('removeClassName', 'current');
    tab.addClassName('current');

    // Set Current Tab State
    this.set("selectedTab", tab);

    // Switch View
    this._switchView(tab, animated);

    // Call the internal callback that will handle anything that needs to
    // happen after a tab has been selected, including notifying the delegate.
    this._didSelectTab(tab);
  },

  /**
   * Aphid.UI.TabViewController#selectDefaultTab([animated = false]) -> null
   *
   * - animated (Boolean): specifies whether or not the tab should be selected
   *   with animation (defaults to false).
   *
   * Selects the default tab, as defined by the
   * [[Aphid.UI.TabViewController#defaultTab]] property, or the first tab in
   * the tab view if a default tab has not been defined.
  **/
  selectDefaultTab: function(animated)
  {
    if (Object.isUndefined(animated)) animated = false;
    if (this.get("defaultTab"))
      this.selectTab(this.get("defaultTab"), animated);
    else
      this.selectTab(this.get("tabs").first(), animated);
  },

  // Event Handling ----------------------------------------------------------

  handleClickEvent: function(event)
  {
    var tab = event.findElement("li[data-tab]");
    if (tab) this.selectTab(tab);
  },

  // Support Methods ---------------------------------------------------------

  /*
   * Aphid.UI.TabViewController#_findTabByName(tabName) -> Element | false
   *
   * - tabName (String): the name of the tab, as specified in the tab items
   *   data-tab attribute.
   * 
   * Iterates the `tabs` property and returns the first tab element that
   * matches the data-tab attribute with the provided *tabName*.
   */
  _findTabByName: function(tabName)
  {
    return this.get("tabs").find(
      function(tab)
      {
        if (tab.getData("tab") == tabName)
          return true;
      }
    );
  },

  /*
   * Aphid.UI.TabViewController#_switchView(tab) -> null
   *
   * - tab (Element): the tab Element
   *
   * Attempts to switch the content view based on the data-view and
   * data-content-view-class attributes on the tab Element.
   */
  _switchView: function(tab, animated)
  {
    // Instantiate & Switch to View
    var view      = tab.getData('view'),
        viewClass = tab.getData('content-view-class'),
        viewClassImplementation;

    // Initialize the View
    if (!this[view] && viewClass)
    {
      viewClassImplementation = resolveClassName(viewClass);
      this[view] = new viewClassImplementation({ delegate: this });
    }

    // Set the View as the Content View
    this.contentView.setViewAnimated(this[view], animated);
  },

  // Callbacks ---------------------------------------------------------------

  /*
   * Aphid.UI.TabViewController#_shouldSelectTab(tab) -> Boolean
   *
   * Checks for basic conditions that should prevent tab selection from
   * occurring, such as the tab already being selected. It also evaluates the
   * `shouldSelectTab` callback and the `tabViewShouldSelectTab` delegate
   * method before returning *true* or *false*.
   *
   * Delegates have the final say in whether or not the tab should be
   * selected.
   */
  _shouldSelectTab: function(tab)
  {
    var shouldSelect = true;
    if (tab == this.get("selectedTab"))
      shouldSelect = false;
    if (this.shouldSelectTab)
      shouldSelect = this.shouldSelectTab(tab);
    this.callDelegateMethod("tabViewShouldSelectTab", tab);
    return shouldSelect;
  },

  /*
   * Aphid.UI.TabViewController#_didSelectTab(tab) -> null
   *
   * Performs any internal actions after a tab has been selected before
   * calling the `didSelectTab` callback and the `tabViewSelectionDidChange`
   * delegate method.
   */
  _didSelectTab: function(tab)
  {
    // Persist Tab Selection
    if (this.get("persistSelectedTab"))
    {
      var tabName = tab.getData('tab');
      $C.set(this.displayName + '.selectedTab', tabName);
    }

    // Call the public callback, that may have been implemented by a subclass.
    if (this.didSelectTab)
      this.didSelectTab(tab);

    // Call the tabViewSelectionDidChange method on the delegate, if the
    // delegate has defined it.
    this.callDelegateMethod("tabViewSelectionDidChange", tab);
  }

});
