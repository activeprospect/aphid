/**
 * class Aphid.Model.CollectionProxy < Aphid.Support.Object
 *
 * An instance of this class is returned any time you load a collection of
 * model objects using [[Aphid.Model.Base.loadCollection]].
**/

Aphid.Model.CollectionProxy = Aphid.Class.create("Aphid.Model.CollectionProxy", Aphid.Support.Object,
{

  /**
   * Aphid.Model.CollectionProxy#isLoaded -> Boolean
   *
   * Denotes whether the collection has been fully loaded and initialized.
   * Since the loading of model data can happen asynchronously, this attribute
   * may be referenced and monitored to know when the collection has finished
   * loading.
  **/
  isLoaded: false,

  /**
   * Aphid.Model.CollectionProxy#isLoading -> Boolean
  **/
  isLoading: false,

  /**
   * Aphid.Model.CollectionProxy#collection -> Boolean
  **/
  collection: false,

  /**
   * Aphid.Model.CollectionProxy#modelKlass -> Boolean
   *
   * The class definition of the model that this collection represents.
  **/
  modelKlass: false,

  // -------------------------------------------------------------------------

  initialize: function($super, options)
  {
    this.collection = $A();
    $super(options);
  },

  push: function()
  {
    this.get("collection").push.apply(this.collection, arguments);
  },

  _each: function(iterator)
  {
    this.get("collection").each(iterator);
  },

  // Callbacks ---------------------------------------------------------------

  _afterLoad: function()
  {

    // Call Callback Method
    if (this.afterLoad)
      this.afterLoad(this);

    // Call Delegate Method
    this.callDelegateMethod("modelDidFinishLoading");

    // Post Notification
    this.postNotification("ModelDidLoadNotification");

  },

  // -------------------------------------------------------------------------

  /**
   * Aphid.Model.CollectionProxy#appendCollection() -> Aphid.Model.CollectionProxy
  **/
  appendCollection: function()
  {
    var url        = false,
        options    = false,
        modelKlass = this.get("modelKlass");

    // Parse Arguments
    if (Object.isString(arguments[0]))
    {
      url     = arguments[0];
      options = $H(arguments[1]);
    }
    else options = $H(arguments[0]);

    // Set URL
    if (!url)
      url = modelKlass.prototype.get("siteUrl").concat(modelKlass.prototype.get("collectionPath"));

    // Check for Required URL Template Properties
    var requiredProperties = url.match(/#\{[a-zA-Z]+\}/g);
    if (requiredProperties)
    {
      var missingProperties = requiredProperties.collect(function(requiredProperty) {
        property = requiredProperty.gsub(/[^a-zA-Z]/, "");
        if (!options.get(property)) return property;
      }).compact();
      if (missingProperties.size() > 0)
        $L.warn("URL (\"" + url + "\") is missing " + "property".pluralize(missingProperties.size(), "properties") + " (" + missingProperties.join(", ") + ") and may not load correctly as a result.", this.className);
    }

    // Replace Template Variables in URL
    var template = new Template(url);
    url = template.evaluate(options);

    $L.info("Appending records at URL: " + url + " ...", this.className);

    // Request Options
    var requestOptions = {
      method: "GET",
      asynchronous: true,
      contentType: 'application/json',
      onSuccess: this._handleAppendCollectionResponse.bind(this, modelKlass),
      onFailure: this._handleFailureResponse.bind(this, modelKlass),
      onException: function(transport, exception) { throw exception; }
    };

    // Make Request
    new Ajax.Request(url, requestOptions);

    return this;
  },

  _handleAppendCollectionResponse: function(klass, transport)
  {
    var object = transport.responseJSON;

    // Custom Collection Response Parsing
    if (klass.prototype.parseCollectionResponse)
      object = klass.prototype.parseCollectionResponse(transport);

    object.each(function(attributes) {
      instance = new klass(attributes);
      instance.set("isLoaded", true);
      instance.set("isLoading", false);
      instance._afterLoad();
      this.push(instance);
    }, this);

    this.set("isLoaded", true);
    this.set("isLoading", false);

    this.callDelegateMethod("modelDidFinishAppending");
  },

  // Failure Responses -------------------------------------------------------

  _handleFailureResponse: function(transport)
  {
    this.set("isLoaded", false);
    this.set("isLoading", false);

    // Post Notification
    this.postNotification("ModelFailureNotification", transport);

    // Call Delegate Method
    this.callDelegateMethod("modelDidFailWithError", transport);
  },

  // -------------------------------------------------------------------------

  /**
   * Aphid.Model.CollectionProxy#reload() -> null
  **/
  reload: function()
  {
    var url        = false,
        options    = false,
        modelKlass = this.get("modelKlass");

    // Parse Arguments
    if (Object.isString(arguments[0]))
    {
      url     = arguments[0];
      options = $H(arguments[1]);
    }
    else options = $H(arguments[0]);

    // Set URL
    if (!url)
      url = modelKlass.prototype.get("siteUrl").concat(modelKlass.prototype.get("collectionPath"));

    // Check for Required URL Template Properties
    var requiredProperties = url.match(/#\{[a-zA-Z]+\}/g);
    if (requiredProperties)
    {
      var missingProperties = requiredProperties.collect(function(requiredProperty) {
        property = requiredProperty.gsub(/[^a-zA-Z]/, "");
        if (!options.get(property)) return property;
      }).compact();
      if (missingProperties.size() > 0)
        $L.warn("URL (\"" + url + "\") is missing " + "property".pluralize(missingProperties.size(), "properties") + " (" + missingProperties.join(", ") + ") and may not load correctly as a result.", this.className);
    }

    // Replace Template Variables in URL
    var template = new Template(url);
    url = template.evaluate(options);

    $L.info("Reloading records at URL: " + url + " ...", this.className);

    // Request Options
    var options = {
      method: "GET",
      asynchronous: true,
      contentType: 'application/json',
      onSuccess: this._handleReloadCollectionResponse.bind(this, modelKlass),
      onFailure: this._handleFailureResponse.bind(this, modelKlass),
      onException: function(transport, exception) { throw exception; }
    };

    // Make Request
    new Ajax.Request(url, options);

    return this;
  },

  _handleReloadCollectionResponse: function(klass, transport)
  {
    var object = transport.responseJSON;
    this.set("collection", $A());

    // Custom Collection Response Parsing
    if (klass.prototype.parseCollectionResponse)
      object = klass.prototype.parseCollectionResponse(transport);

    // Instantiate each instance...
    object.each(function(attributes) {
      instance = new klass(attributes);
      instance.set("isLoaded", true);
      instance.set("isLoading", false);
      instance._afterLoad();
      this.push(instance);
    }, this);

    // Set the loading state on the collection...
    this.set("isLoaded", true);
    this.set("isLoading", false);

    // Post Notification
    this.postNotification("ModelDidReloadNotification", this);
  }

});

Object.extend(Aphid.Model.CollectionProxy.prototype, Enumerable);
