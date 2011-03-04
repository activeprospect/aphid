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
   * ImageView#image -> String | false
   *
   * The URL to the image.
  **/
  image: false,

  /**
   * ImageView#imageElement -> Element | false
   *
   * The Element for the Image.
  **/
  imageElement: false,

  /**
   * ImageView#loaded -> Boolean
   *
   * True if the image has loaded, otherwise false.
  **/
  loaded: false,

  // Image Management --------------------------------------------------------

  /*
   * ImageView#getImageElement() -> Element
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
   * ImageView#setImage(url) -> String
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
   * ImageView#clearImage() -> null
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
      this.get("imageElement").stopObserving("focus", this._handleLoadEventListener);
      this._handleLoadEventListener = false;
    }

    // Load Events
    if (this._handleLoadEventListener)
    {
      this.get("imageElement").stopObserving("focus", this._handleLoadEventListener);
      this._handleLoadEventListener = false;
    }

  },

  handleLoadEvent: function(event)
  {
    this.set("loaded", true);
    this.get("imageElement").appear({ duration: 0.5 });
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
    if (this.delegate && this.delegate.imageViewDidLoad)
      this.delegate.imageViewDidLoad(this);
  },

  _imageLoadDidFail: function()
  {
    // Call the Callback Method
    if (this.imageLoadDidFail)
      this.imageLoadDidFail();

    // Call the Delegate Method
    if (this.delegate && this.delegate.imageViewLoadDidFail)
      this.delegate.imageViewLoadDidFail(this);
  }

});
