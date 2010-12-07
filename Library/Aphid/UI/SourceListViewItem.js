/**
 * class Aphid.UI.SourceListViewItem < Aphid.UI.ListViewItem
 *
 * A list view item implementation that provides an icon, content and
 * accessory view that is suitable for use with an [[Aphid.UI.SourceListView]].
**/

Aphid.UI.SourceListViewItem = Class.create(Aphid.UI.ListViewItem, {

  displayName: "Aphid.UI.SourceListViewItem",

  /**
   * Aphid.UI.SourceListViewItem#contentView -> Aphid.UI.View | false
  **/
  contentView: false,

  /*
   * Aphid.UI.SourceListViewItem#_customContentView -> Boolean
   */
  _customContentView: false,

  /**
   * Aphid.UI.SourceListViewItem#title -> String
   *
   * The list view item title.
   *
   * **Note:** This property may not be set if a custom contentView has been
   * set.
  **/
  title: false,

  /**
   * Aphid.UI.SourceListViewItem#iconView -> Aphid.UI.View | false
  **/
  iconView: false,

  /*
   * Aphid.UI.SourceListViewItem#_customIconView -> Boolean
   */
  _customIconView: false,

  /**
   * Aphid.UI.SourceListViewItem#icon -> String | false
   *
   * The relative path to the icon to be used.
   * 
   * **Note:** This property may not be set if a custom iconView has been set.
  **/
  icon: false,

  /**
   * Aphid.UI.SourceListViewItem#accessoryView -> Aphid.UI.View | false
  **/
  // accessoryView: false,

  /**
   * Aphid.UI.SourceListViewItem#badge -> Integer | String | false
   *
   * A badge count or label to use.
  **/
  badge: false,

  // Initialization ----------------------------------------------------------

  /**
   * new Aphid.UI.SourceListViewItem([options])
   *
   * - options (Hash): Initial property values to be set on the
   *   SourceListViewItem instance
   *
   * Initializes a new SourceListViewItem instance.
  **/
  initialize: function($super, options)
  {
    $super(options);
  },

  viewDidLoad: function($super)
  {
    this.title = this.get("contentView.element").innerHTML;
    // this.icon = this.get("iconView.element").down("img").readAttribute("src");
    $super();
  },

  // -------------------------------------------------------------------------

  // TODO This should probably be handled in Aphid.UI.View so that it can wire up the HTML
  setElement: function(element)
  {
    this.element = element;

    this._connectToOutlets();
    this._wireActionsToInstance();

    // Detect Icon View
    // TODO Should _connectToOutlets use property setters?
    if (this.iconView)
      this.element.addClassName("icon");

    // Set Badge
    // TODO setElement should iterate and set data-* properties
    var badge = element.getData("badge");
    if (badge) this.set("badge", badge);

    return this.element;
  },

  getIconView: function()
  {
    if (!this.iconView)
    {
      this.iconView = new Aphid.UI.View();
      this.iconView.get("element").addClassName("iconView");
    }
    return this.iconView;
  },

  setIconView: function(iconView)
  {
    this.iconView = iconView;
    this._customIconView = true;
    return this.iconView;
  },

  getContentView: function()
  {
    if (!this.contentView)
    {
      this.contentView = new Aphid.UI.View();
      this.contentView.get("element").addClassName("contentView");
    }
    return this.contentView;
  },

  setContentView: function(contentView)
  {
    this.contentView = contentView;
    this._customContentView = true;
    return this.contentView;
  },

  /**
   * Aphid.UI.SourceListViewItem#setIcon -> String
  **/
  setIcon: function(icon)
  {
    this.icon = icon;

    // Set Up Image View
    // TODO This should be an Aphid.UI.ImageView instance...
    var imageElement = new Element("img");
    imageElement.writeAttribute("src", "Resources/Images/" + icon);
    this.get("iconView.element").update(imageElement);

    // Add the "icon" CSS Class to the View
    this.get("element").addClassName("icon");

    // Add Icon View to View
    if (!this.get("iconView.superview"))
      this.addSubview(this.get("iconView"));

    return this.icon;
  },

  /**
   * Aphid.UI.SourceListViewItem#setTitle -> String
  **/
  setTitle: function(title)
  {
    this.title = title;

    // Add Title to Content View
    this.get("contentView.element").update(this.title);

    // Add Content View to View
    if (!this.get("contentView.superview"))
      this.addSubview(this.get("contentView"));

    return this.title;
  },

  /**
   * Aphid.UI.SourceListViewItem#setBadge -> Integer | String
  **/
  setBadge: function(badge)
  {
    this.badge = badge;
    this.get("element").setData("badge", this.badge);
    return this.badge;
  }

});

// Method Name Mappings for Debugging ----------------------------------------

// Aphid.UI.SourceListViewItem.prototype.select.displayName = "Aphid.UI.ListViewItem.select";
// Aphid.UI.SourceListViewItem.prototype.deselect.displayName = "Aphid.UI.ListViewItem.deselect";
