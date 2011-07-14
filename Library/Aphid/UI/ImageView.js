/**
 * class Aphid.UI.ImageView < Aphid.UI.View
 *
 * Wraps an HTML &lt;img/&gt; element and observes for load and error events,
 * dispatching those events to callbacks defined on a subclass or methods on
 * the delegate.
 *
 * #### Callback Methods
 *
 *  - `imageDidLoad()` — Called once the image has completed loading.
 *
 *  - `imageLoadDidFail()` — Called if the image fails to load for any reason.
 *
 * #### Delegate Methods
 *
 *  - `imageViewDidLoad(imageView)` — Called once the image has completed
 *    loading.
 *
 *  - `imageViewLoadDidFail(imageView)` — Called if the image fails to load
 *    for any reason.
 *
**/

Aphid.UI.ImageView = Aphid.Class.create("Aphid.UI.ImageView", Aphid.UI.View, {

  /**
   * Aphid.UI.ImageView#image -> String | false
   *
   * The URL to the image.
  **/
  image: false,

  /**
   * Aphid.UI.ImageView#imageElement -> Element | false
   *
   * The Element for the Image.
  **/
  imageElement: false,

  /**
   * Aphid.UI.ImageView#loaded -> Boolean
   *
   * True if the image has loaded, otherwise false.
  **/
  loaded: false,

  // Image Management --------------------------------------------------------

  /*
   * Aphid.UI.ImageView#getImageElement() -> Element
   *
   * Lazily initializes the <img/> element to be managed by the ImageView
   * instance and adds it to the ImageView's element before returning it.
  **/
  getImageElement: function()
  {
    if (!this.imageElement)
    {
      this.imageElement = new Element("img").hide();
      this.get("element").insert(this.imageElement);
    }
    return this.imageElement;
  },

  /**
   * Aphid.UI.ImageView#setImage(url) -> String
   *
   * Sets the URL to the image on the managed image element.
  **/
  setImage: function(image)
  {
    this.image = image;
    this.get("imageElement").writeAttribute("src", image);
    return image;
  },

  /**
   * Aphid.UI.ImageView#clearImage() -> null
   *
   * Clears and hides the image view.
  **/
  clearImage: function()
  {
    this.set("loaded", false);
    this.set("image", false);
    this.get("imageElement").hide();
    this.get("imageElement").removeAttribute("src");
  },

  // View Callbacks ----------------------------------------------------------

  viewDidLoad: function($super)
  {
    $super();
    this._startObservingImageEvents();
  },

  viewWillAppear: function()
  {
    if (!this.get("loaded"))
      this.get("imageElement").hide();
  },

  // Event Handlers ----------------------------------------------------------

  _startObservingImageEvents: function()
  {

    // Load Events
    if (this.handleLoadEvent && !this._handleLoadEventListener)
    {
      $L.debug("Observing for Load Events", this);
      this._handleLoadEventListener = this.handleLoadEvent.bindAsEventListener(this);
      this.get("imageElement").observe("load", this._handleLoadEventListener);
    }

    // Error Events
    if (this.handleErrorEvent && !this._handleErrorEventListener)
    {
      $L.debug("Observing for Error Events", this);
      this._handleErrorEventListener = this.handleErrorEvent.bindAsEventListener(this);
      this.get("imageElement").observe("error", this._handleErrorEventListener);
    }

  },

  _stopObservingImageEvents: function()
  {

    // Load Events
    if (this._handleLoadEventListener)
    {
      this.get("imageElement").stopObserving("load", this._handleLoadEventListener);
      this._handleLoadEventListener = false;
    }

    // Load Events
    if (this._handleErrorEventListener)
    {
      this.get("imageElement").stopObserving("error", this._handleErrorEventListener);
      this._handleErrorEventListener = false;
    }

  },

  handleLoadEvent: function(event)
  {
    this.set("loaded", true);
    if (this.get("visible"))
      this.get("imageElement").appear({ duration: 0.35 });
    else
      this.get("imageElement").show();
    this._imageDidLoad();
  },

  handleErrorEvent: function(event)
  {
    this.set("loaded", false);
    this.get("imageElement").hide();
    this._imageLoadDidFail();
  },

  _imageDidLoad: function()
  {
    // Call the Callback Method
    if (this.imageDidLoad)
      this.imageDidLoad();

    // Call the Delegate Method
    this.callDelegateMethod("imageViewDidLoad");
  },

  _imageLoadDidFail: function()
  {
    // Call the Callback Method
    if (this.imageLoadDidFail)
      this.imageLoadDidFail();

    // Call the Delegate Method
    this.callDelegateMethod("imageViewLoadDidFail");
  }

});
