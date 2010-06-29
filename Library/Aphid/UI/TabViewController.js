//
// Tab View Controller
//
// <ul class="tabs">
//   <li class="tab" data-view="firstTabView">Tab 1</li>
//   <li class="tab" data-view="secondTabView">Tab 2</li>
// </ul>
//
// <section data-outlet="firstTabView">
//   First Tab!
// </section>
//
// <section data-outlet="secondTabView">
//   Second Tab!
// </section>
//

Aphid.UI.TabViewController = Class.create(Aphid.UI.ViewController, {

  viewName: false,

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
  },

  // View Delegate Methods

  viewDidFinishLoading: function(view)
  {
  },

  // -------------------------------------------------------------------------

  _setupObservers: function()
  {
    var observeTab = function(tab)
    {
      tab.observe('click', this._didSelectTab.bind(this));
    }
    this.tabs.each(observeTab.bind(this));
  },

  // -------------------------------------------------------------------------

  _didSelectTab: function(event)
  {
    var tab = event.element();

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
