/**
 * class Aphid.UI.TabViewController
 *
 * Tab View Controller
 *
 * **Initializing From HTML**
 *
 *     // In your View Template:
 *     <ul class="tabs">
 *       <li class="tab" data-tab="tab-1" data-view="firstTabView">Tab 1</li>
 *       <li class="tab" data-tab="tab-2" data-view="secondTabView">Tab 2</li>
 *     </ul>
 *
 *     <section data-outlet="firstTabView">
 *       First Tab!
 *     </section>
 *
 *     <section data-outlet="secondTabView">
 *       Second Tab!
 *     </section>
 *
**/

Aphid.UI.TabViewController = Class.create(Aphid.UI.ViewController, {

  viewName: false,
  persistSelectedTab: false,
  defaultTab: false,

  // Tabs
  tabs: false,

  // Views
  contentView: false,

  // State
  currentTab: false,

  // -------------------------------------------------------------------------

  initialize: function($super, delegate)
  {
    $super(delegate);
  },

  // View Callbacks

  viewDidLoad: function()
  {
    var tabElements = this.element.select('li');
    this.tabs = tabElements
    this._setupObservers();

    // Select Persisted Tab...
    if (this.persistSelectedTab)
    {
      var selectedTab = $C.get(this.viewName + '.selectedTab');
      if (selectedTab)
      {
        $L.info('Restoring previously selected tab "' + selectedTab + '"');
        this.selectTab(selectedTab);
        return;
      }
    }

    // ... or Default Tab
    $L.info('Selecting default tab "' + this.defaultTab + '"');
    this.selectDefaultTab();
  },

  // -------------------------------------------------------------------------

  selectTab: function(tab)
  {
    // Allow selectTab to be called with an Event or an Element
    if (!Object.isElement(tab))
    {
      if (Object.isEvent(tab))
        tab = tab.element();
      else if (Object.isString(tab))
      {
        var tabName = tab;
        tab = this._findTab(tabName);
        if (Object.isUndefined(tab))
        {
          $L.warn('Tried to select a tab (' + tabName + ') that could not be found in the template');
          return;
        }
      }
    }

    // Check with shouldSelectTab to be sure that we are in a state that will
    // allow for its selection...
    if (!this._shouldSelectTab(tab))
      return;

    // Select the Tab
    this.tabs.invoke('removeClassName', 'current');
    tab.addClassName('current');

    // Set Current Tab State
    this.currentTab = tab;

    // Persist Tab Selection
    if (this.persistSelectedTab)
    {
      var tabName = tab.getAttribute('data-tab');
      $C.set(this.viewName + '.selectedTab', tabName);
    }

    if (this.didSelectTab)
      this.didSelectTab(tab);
  },

  selectDefaultTab: function()
  {
    if (this.defaultTab)
      this.selectTab(this.defaultTab);
    else
      this.selectTab(this.tabs.first());
  },

  _findTab: function(tabName)
  {
    return this.tabs.find(
      function(tab)
      {
        if (tab.getAttribute('data-tab') == tabName)
          return true;
      }
    )
  },

  // -------------------------------------------------------------------------

  _setupObservers: function()
  {
    var observeTab = function(tab)
    {
      tab.observe('click', this.selectTab.bind(this));
    }
    this.tabs.each(observeTab.bind(this));
  },

  // -------------------------------------------------------------------------

  // TODO This should simply be didSelectTab and subclasses should call $super()
  _didSelectTab: function(event)
  {
    var tab     = event.element();
    var tabName = tab.getAttribute('data-tab');

    if (!this._shouldSelectTab(tab)) return;

    this.currentTab = tab;

    this.tabs.invoke('removeClassName', 'current');
    tab.addClassName('current');


    if (this.didSelectTab)
      this.didSelectTab(tab);
  },

  // didSelectTab: function(tab)
  // {
  //   $L.info('Selected tab: ' + tab)
  // },

  // TODO This should simply be shouldSelectTab and subclasses should call $super()
  _shouldSelectTab: function(tab)
  {
    var shouldSelect = true;
    if (tab == this.currentTab) shouldSelect = false;
    if (this.shouldSelectTab) shouldSelect = this.shouldSelectTab(tab);
    return shouldSelect;
  },

  // shouldSelectTab: function(tab)
  // {
  //   $L.info('Should select tab? ' + tab)
  // }

});

// TODO Encapsulate the individual tab logic into its own model
// Aphid.UI.TabViewController.Tab = Class.create({
//
// });
