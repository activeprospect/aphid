/**
 * class Aphid.Model.Base < Aphid.Support.Object
 *
 *
 *
 * # Implementation Example
 *
 *     var Widget = Aphid.Class.create("Widget", Aphid.Model.Base, {
 *       siteUrl: "http://example.com/api",
 *       instancePath: "/widgets/#{identifier}.json",
 *       collectionPath: "/widgets.json"
 *     });
 *
 * # Usage Example
 *
 *     this.widgets = Widget.loadCollection({ delegate: this });
 *     ...
 *     modelDidFinishLoading: function(model)
 *     {
 *     }
 *
 * # Callback Methods
 *
 *  - `afterLoad`
 *  - `afterReload`
 *  - `afterDestroy`
 *
 * # Delegate Methods
 *
 *  - `modelDidFinishLoading(model)`
 *  - `modelDidFinishReloading(model)`
 *  - `modelWasDestroyed(model)`
 *  - `modelDidFailWithError(model, transport)`
 *
 * # Posted Notifications
 *
 *  - `ModelDidLoadNotification`
 *  - `ModelDidReloadNotification`
 *  - `ModelWasDestroyedNotification`
 *  - `ModelFailureNotification`
 *
**/

//= require "CollectionProxy"

Aphid.Model.Base = Aphid.Class.create("Aphid.Model.Base", Aphid.Support.Object,
{

  /**
   * Aphid.Model.Base#identifierProperty -> String | "id"
  **/
  identifierProperty: "id",

  /**
   * Aphid.Model.Base#siteUrl -> String | false
   *
   * This is the base site URL that will be used when constructing the
   * URLs for operating on instances or collections of this model.
   *
   * # Example
   *
   *    "http://www.example.com/api"
   *
  **/
  siteUrl: window.location.protocol + "//" + window.location.host,

  /**
   * Aphid.Model.Base#collectionPath -> String | false
   *
   * The URL fragment template to be used when loading a collection of records
   * for the model. The string may include other properties to construct the
   * final path by enclosing the property name in #{} (i.e. #{propertyName}).
   *
   * #### Example
   *
   *     "/account/#{accountId}/contacts/#{id}.json?option=foo"
   *
  **/
  collectionPath: false,

  /**
   * Aphid.Model.Base#instancePath -> String | false
   *
   * The URL fragment template to be used when loading a collection of records
   * for the model. The string might my include other properties to construct
   * the final path by enclosing the property name in #{} (i.e.
   * #{propertyName}). Unless the instance is a singleton, with no ID required
   * to load it, you should include #{id} at the point where the ID should be
   * inserted.
   *
   * #### Example
   *
   *     "/contacts/#{id}.json?option=foo"
   *
  **/
  instancePath: false,

  /**
   * Aphid.Model.Base#hasMany -> Hash
  **/
  hasMany: {},

  /**
   * Aphid.Model.Base#belongsTo -> Hash
  **/
  belongsTo: {},

  /**
   * Aphid.Model.Base#isLoaded -> Boolean
   *
   * Denotes whether the model has been fully loaded and initialized. Since
   * the loading of model data can happen asynchronously, this attribute may
   * be referenced and monitored to know when the model has finished loading.
  **/
  isLoaded: false,

  /**
   * Aphid.Model.Base#isLoading -> Boolean
  **/
  isLoading: false,

  /**
   * Aphid.Model.Base#isDestroyed -> Boolean
   *
   * Denotes whether the model instance has been destroyed.
  **/
  isDestroyed: false,

  // -------------------------------------------------------------------------

  /**
   * new Aphid.Model.Base([options])
   *
   * - options (Hash): Initial property values to be set on the Model instance
  **/
  initialize: function($super, options)
  {
    $super(options);
    if (options) this._initializeFromObject(options);
    this._afterInitialize();
  },
  
  /**
   * Aphid.Model.Base#equals(object) -> Boolean
   *
   * Returns false if the specified object does not implement the #has and #get functions.
   * Otherwise, returns true if the specified object instance has the same class name and ID as 
   * this. 
  **/
  equals: function(other) 
  {
    if (!other || !other.has || !other.get || !other.has("identifier") || !other.has("className"))
      return false;
    return this.get("className") == other.get("className") && this.get("identifier") == other.get("identifier");
  },

  /*
   * Aphid.Model.Base#_initializeFromObject(object) -> null
   *
   * Initializes the instance from a JavaScript object by applying any of the
   * attributes for this model that are found in the object to the instance.
   */
  _initializeFromObject: function(object)
  {
    $H(object).each(this._initializeProperty, this);

    // this.properties.each(
    //   function(pair)
    //   {
    //     var property = pair.key,
    //         options  = pair.value,
    //         key      = options["key"] || property,
    //         value    = Object.isUndefined(key) ? "null" : this.object[key];
    //
    //     $L.debug('Setting value of property "' + property + '" to "' + value + '"', this);
    //
    //     if (value)
    //     {
    //       this[property] = value;
    //       this["_" + property] = Object.isUndefined(value.clone) ? value : value.clone();
    //     }
    //     else
    //     {
    //       this[property] = null;
    //       this["_" + property] = null;
    //     }
    //   }.bind(this)
    // );
    // if (this.identifierAttribute && !this.identifier && this[this.identifierAttribute])
    // {
    //   $L.debug('Setting identifier to ' + this[this.identifierAttribute] + '"', this);
    //   this.identifier = this[this.identifierAttribute];
    // }
    // this._instantiateProxies();
  },

  _initializeProperty: function(property)
  {
    var propertyName         = property.key.dasherize().camelize(),
        propertyValue        = property.value,
        belongsToAssociation = $H(this.get("belongsTo")).get(propertyName),
        hasManyAssociation   = $H(this.get("hasMany")).get(propertyName);

    $L.debug("Initializing Property \"" + propertyName + "\" w/Value: " + propertyValue, this);

    // Cast Date Properties ...
    if (property.key.match(/(_at|_on)$/) && propertyValue)
      propertyValue = propertyValue.toDate();

    // Cast Association
    if (belongsToAssociation || hasManyAssociation)
    {
      var className          = (belongsToAssociation || hasManyAssociation).className,
          klass              = resolveClassName(className),
          foreignKeyProperty = property + "Id";

      if (belongsToAssociation)
        this[propertyName] = new klass(propertyValue);
      else
      {
        this[propertyName] = propertyValue.collect(function(object) {
          return new klass(object);
        });
      }
    }

    else
    {
      this[propertyName] = false;
      this["_" + propertyName] = this.set(propertyName, propertyValue);
    }
  },

  // Associations ------------------------------------------------------------

  _initializeAssociations: function()
  {
    $H(this.get("hasMany")).keys().each(function(association) {
      var associationName = "get" + association.upperCaseFirst();
      this[associationName] = this._getHasManyAssociation.bind(this, association);
      if (!this[association]) this[association] = false;
    }, this);
    $H(this.get("belongsTo")).keys().each(function(association) {
      var associationName = "get" + association.upperCaseFirst();
      this[associationName] = this._getBelongsToAssociation.bind(this, association);
      if (!this[association]) this[association] = false;
    }, this);
  },

  _getHasManyAssociation: function(association, options)
  {
    options        = $H(options);
    var assn       = $H(this.get("hasMany")).get(association),
        className  = $H(assn).get("className"),
        klass      = resolveClassName(className),
        collection = this[association];

    if (!collection)
    {

      // If the owning model does not have an identifier, simply return an
      // empty array.
      if (!this.has("id"))
        return $A();

      // Pass the ID of the owning model to the association model, in case
      // it is required to load the model.
      else
        options.set(this.get("foreignKey"), this.get("id"));

      // Set known properties as options to be passed to the association.
      this.get("collectionPathVariables").each(function(property) {
        if (this.has(property))
          options.set(property, this.get(property));
      }, this);

      // Initialize Association Instance
      collection = klass.loadCollection(options);

      // Set Inverse Association (on each instance), if configured...
      collection.each(function(instance) {
        if (instance.get("belongsTo") && $H(instance.get("belongsTo")).get(this.get("className").lowerCaseFirst()))
        {
          if (!instance[this.get("className").lowerCaseFirst()])
            instance[this.get("className").lowerCaseFirst()] = this;
        }
      }, this);
    }

    return collection;
  },

  _getBelongsToAssociation: function(association, options)
  {
    options                = $H(options);
    var assn               = $H(this.get("belongsTo")).get(association),
        className          = $H(assn).get("className"),
        klass              = resolveClassName(className),
        foreignKeyProperty = association + "Id",
        instance           = this[association];

    if (!instance)
    {

      // If the owning model does not have a value for the association
      // foreign key, simply return false.
      if (!this.has(foreignKeyProperty) || !this.get(foreignKeyProperty))
        return false;

      // Pass the ID of the owning model to the association model, in case
      // it is required to load the model.
      if (this.has("id"))
        options.set(this.get("foreignKey"), this.get("id"));

      // Set known properties as options to be passed to the association.
      this.get("instancePathVariables").each(function(property) {
        if (this.has(property))
          options.set(property, this.get(property));
      }, this);

      // Initialize Association Instance
      instance = klass.load(this.get(foreignKeyProperty), options);

      // Set Inverse Association, if configured...
      if (instance.get("belongsTo") && $H(instance.get("belongsTo")).get(this.get("className").lowerCaseFirst()))
      {
        if (!instance[this.get("className").lowerCaseFirst()])
          instance[this.get("className").lowerCaseFirst()] = this;
      }
    }

    return instance;
  },

  instancePathVariables: function()
  {
    var url = this.get("siteUrl").concat(this.get("instancePath"));
    var requiredProperties = url.match(/#\{[a-zA-Z]+\}/g);
    var instancePathVariables = $A();

    if (requiredProperties)
    {
      instancePathVariables = requiredProperties.collect(function(requiredProperty) {
        return requiredProperty.gsub(/[^a-zA-Z]/, "");
      }).compact();
    }

    return instancePathVariables;
  },

  collectionPathVariables: function()
  {
    var url = this.get("siteUrl").concat(this.get("collectionPath"));
    var requiredProperties = url.match(/#\{[a-zA-Z]+\}/g);
    var collectionPathVariables = $A();

    if (requiredProperties)
    {
      collectionPathVariables = requiredProperties.collect(function(requiredProperty) {
        return requiredProperty.gsub(/[^a-zA-Z]/, "");
      }).compact();
    }

    return collectionPathVariables;
  },

  // // Dirty State Tracking ----------------------------------------------------
  //
  // /**
  //  * Aphid.Model#isDirty() -> Boolean
  //  *
  //  * Iterates the attributes of the model instance and checks for any changes
  //  * from the initialized state, returning true if any of the attribute values
  //  * have changed.
  //  *
  //  * This method also looks at all proxied objects that *do not* have an
  //  * identifier, that is to say, proxies that are instantiated from a parent
  //  * object that do not have their own identifier and cannot be loaded or
  //  * saved on their own.
  // **/
  // isDirty: function()
  // {
  //   var isDirty = false;
  //   var properties = this.properties.keys();
  //
  //   properties.each(function(property)
  //   {
  //     if (this.proxies && $H(this.proxies).keys().include(property))
  //     {
  //       if (Object.isArray(this[property]))
  //       {
  //         if (!this[property].compare(this["_" + property]))
  //           isDirty = true;
  //         else
  //         {
  //           this[property].each(function(proxyProperty) {
  //             if (!proxyProperty.identifier && proxyProperty.isDirty())
  //               isDirty = true;
  //           }, this);
  //         }
  //       }
  //     }
  //     else if (Object.isArray(this[property]))
  //     {
  //       if (!this[property].compare(this["_" + property]))
  //         isDirty = true;
  //     }
  //     else if (this[property] != this["_" + property])
  //     {
  //       isDirty = true;
  //     }
  //   }, this);
  //
  //   return isDirty;
  // },
  // -------------------------------------------------------------------------

  /**
   * Aphid.Model#serialize() -> Hash
   *
   * Returns a Hash containing the keys and values that make up the instance
   * attributes for the model. This Hash is suitable for initializing another
   * instance of the model or to convert to JSON for transport to a remote
   * web service.
  **/
  // serialize: function()
  // {
  //   var properties = {};
  //
  //   this.properties.each(function(pair)
  //   {
  //     var property = pair.key,
  //         options  = pair.value,
  //         key      = options["key"] || property,
  //         value    = Object.isUndefined(key) ? "null" : this.object[key];
  //
  //     // Undefined Properties
  //     if (Object.isUndefined(this[property]) || this[property] == null)
  //       properties[key] = "";
  //
  //     // Arrays (Values, Model Relationships, etc)
  //     else if (Object.isArray(this[property]))
  //     {
  //       properties[key] = this[property].collect(
  //         function(tuple) {
  //           return Object.isUndefined(tuple.serialize) ? tuple : tuple.serialize()
  //         }
  //       );
  //     }
  //
  //     // Model Relationships
  //     else if (this[property].serialize)
  //       properties[key] = this[property].serialize();
  //
  //     // Simple Value
  //     else
  //       properties[key] = this[property];
  //   }, this);
  //
  //   return properties;
  // },

  /**
   * Aphid.Model.Base#reload() -> null
  **/
  reload: function()
  {
    var url = this.get("siteUrl").concat(this.get("instancePath"));
    this.identifier = false;
    this.set("identifier", this.get("id"));
    // TODO identifier needs to be set automatically to the configured identifier attribute's value

    // Check for Required URL Template Properties
    var requiredProperties = url.match(/#\{[a-zA-Z]+\}/g);
    if (requiredProperties)
    {
      var missingProperties = requiredProperties.collect(function(requiredProperty) {
        property = requiredProperty.gsub(/[^a-zA-Z]/, "");
        if (!this.get(property)) return property;
      }, this).compact();
      if (missingProperties.size() > 0)
      {
        $L.error("Cannot assemble URL (\"" + url + "\") with missing " + "property".pluralize(missingProperties.size(), "properties") + ": " + missingProperties.join(", "), this);
        return;
      }
    }

    // Replace Template Variables in URL
    var template = new Template(url);
    url = template.evaluate(this);

    $L.info("Reloading Record at URL: " + url + " ...", this);

    // Request Options
    var options = {
      method: "GET",
      asynchronous: true,
      contentType: 'application/json',
      onSuccess: this._handleReloadResponse.bind(this),
      onFailure: this._handleFailureResponse.bind(this),
      onException: function(transport, exception) { throw exception; }
    };

    // Make Request
    new Ajax.Request(url, options);
  },

  _handleReloadResponse: function(transport)
  {
    var object = transport.responseJSON;
    this._initializeFromObject(object);
    this.set("isLoaded", true);
    this.set("isLoading", false);
    this._afterReload();
  },

  /**
   * Aphid.Model.Base#destroy() -> Aphid.Model.Base
  **/
  destroy: function()
  {
    if (this.get("isDestroyed")) return;

    var url = this.get("siteUrl").concat(this.get("instancePath"));
    this.identifier = false;
    this.set("identifier", this.get("id"));
    // TODO identifier needs to be set automatically to the configured identifier attribute's value

    // Check for Required URL Template Properties
    var requiredProperties = url.match(/#\{[a-zA-Z]+\}/g);
    if (requiredProperties)
    {
      var missingProperties = requiredProperties.collect(function(requiredProperty) {
        property = requiredProperty.gsub(/[^a-zA-Z]/, "");
        if (!this.get(property)) return property;
      }, this).compact();
      if (missingProperties.size() > 0)
      {
        $L.error("Cannot assemble URL (\"" + url + "\") with missing " + "property".pluralize(missingProperties.size(), "properties") + ": " + missingProperties.join(", "), this);
        return;
      }
    }

    // Replace Template Variables in URL
    var template = new Template(url);
    url = template.evaluate(this);

    $L.info("Destroying record at URL: " + url + " ...", this);

    // Request Options
    var requestOptions = {
      method: "DELETE",
      asynchronous: false,
      onSuccess: this._handleDestroyResponse.bind(this),
      onFailure: this._handleFailureResponse.bind(this),
      onException: function(transport, exception) { throw exception; }
    };

    // Add the Authenticity Token, if available...
    if (Aphid.Model.Base.authenticityToken)
    {
      requestOptions.requestHeaders = {
        "X-CSRF-Token": Aphid.Model.Base.authenticityToken
      };
    }

    // Make Request
    new Ajax.Request(url, requestOptions);

    return this;
  },

  _handleDestroyResponse: function(transport)
  {
    this.set("isDestroyed", true);
    this._afterDestroy();
  },

  // Failure Responses -------------------------------------------------------

  _handleFailureResponse: function(transport)
  {
    this.set("isLoaded", false);
    this.set("isLoading", false);

    // Post Notification
    this.postNotification("ModelFailureNotification", transport);

    // Call Delegate Method
    if (this.get("delegate") && this.get("delegate").modelDidFailWithError)
      this.get("delegate").modelDidFailWithError(this, transport);
  },

  // Callbacks ---------------------------------------------------------------

  _afterInitialize: function()
  {
    this._initializeAssociations();
    if (this.afterInitialize)
      this.afterInitialize(this);
  },

  _afterLoad: function()
  {

    // Call Callback Method
    if (this.afterLoad)
      this.afterLoad(this);

    // Call Delegate Method
    if (this.delegate && this.delegate.modelDidFinishLoading)
      this.delegate.modelDidFinishLoading(this);

    // Post Notification
    this.postNotification("ModelDidLoadNotification");

  },

  _afterReload: function()
  {

    // Call Callback Method
    if (this.afterReload)
      this.afterReload(this);

    // Call Delegate Method
    if (this.delegate && this.delegate.modelDidFinishReloading)
      this.delegate.modelDidFinishReloading(this);

    // Post Notification
    this.postNotification("ModelDidReloadNotification");

  },

  _afterDestroy: function()
  {

    // Call Callback Method
    if (this.afterDestroy)
      this.afterDestroy(this);

    // Call Delegate Method
    if (this.delegate && this.delegate.modelWasDestroyed)
      this.delegate.modelWasDestroyed(this);

    // Post Notification
    this.postNotification("ModelWasDestroyedNotification");

  },

  // -------------------------------------------------------------------------

  // /**
  //  * Aphid.Model#toTemplateReplacements() -> Hash
  //  *
  //  * Returns a Hash suitable for use with Prototype's Template and string
  //  * interpolation functionality.
  // **/
  // toTemplateReplacements: function()
  // {
  //   var properties = {};
  //   this.properties.keys().each(
  //     function(property)
  //     {
  //       properties[property] = this.get(property);
  //     }.bind(this)
  //   );
  //   return properties;
  // }

  getInstancePath: function(data)
  {
    if (Object.isUndefined(data)) return this.instancePath;

    var template = new Template(this.get("instancePath")),
        path     = template.evaluate(data);

    return path;
  },

  // TODO Allow primary key name to be configured (instead of assuming id)
  foreignKey: false,
  getForeignKey: function()
  {
    if (!this.foreignKey)
      this.set("foreignKey", this.get("foreignProperty").concat("Id"));
    return this.foreignKey;
  },

  foreignProperty: false,
  getForeignProperty: function()
  {
    if (!this.foreignProperty)
      this.set("foreignProperty", this.get("className").lowerCaseFirst());
    return this.foreignProperty;
  }

});

// Class Methods -------------------------------------------------------------

/**
 * mixin Aphid.Model.Base.ClassMethods
 *
 * These methods are automatically added to subclasses of Aphid.Model.Base.
**/
Aphid.Model.Base.ClassMethods = {

  /**
   * Aphid.Model.Base.load(identifier_or_url[, options]) -> Object | false
   *
   *  - identifier_or_url (String | Number): Either an identifier or a URL
   *    to the resource to be loaded. The URL may be either absolute or
   *    relative to the siteUrl defined on the model.
   *
   *  - options (Hash): Options to be passed to the URL.
   *
   * Models may be loaded by either specifying the identifier for the record
   * to be loaded or by URL. The first parameter passed to load should be one
   * or the other.
   *
  **/
  load: function()
  {
    var identifier = false,
        url        = false,
        options    = false,
        modelKlass = this;

    // Parse Arguments
    if (Object.isString(arguments[0]) || Object.isNumber(arguments[0]))
    {
      if (arguments[0].toString().match(/^http/)) url = arguments[0];
      else identifier = arguments[0];
      options = $H(arguments[1]);
    }
    else options = $H(arguments[0]);

    // Load by ID
    if (identifier)
      options.set("identifier", identifier);

    // Set URL
    if (!url)
      url = modelKlass.prototype.get("siteUrl").concat(modelKlass.prototype.get("instancePath"));

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

    $L.info("Loading record at URL: " + url + " ...", this.className);

    var instance = new modelKlass(options);
    instance.set("isLoading", true);

    // Request Options
    var requestOptions = {
      method: "GET",
      asynchronous: true,
      contentType: 'application/json',
      onSuccess: this._handleLoadResponse.bind(this, instance),
      onFailure: this._handleFailureResponse.bind(this, instance),
      onException: function(transport, exception) { throw exception; }
    };

    // Make Request
    new Ajax.Request(url, requestOptions);

    return instance;
    // return instance.get("isLoaded") ? instance : false;
  },

  // TODO Move this to a method in the prototype
  _handleLoadResponse: function(instance, transport)
  {
    var object = transport.responseJSON;

    // Custom Instance Response Parsing
    if (instance.parseInstanceResponse)
      object = instance.parseInstanceResponse(transport);

    instance._initializeFromObject(object);
    instance.set("isLoaded", true);
    instance.set("isLoading", false);
    instance._afterLoad();
  },

  /**
   * Aphid.Model.Base.loadCollection([url[, options]]) -> Object | false
   *
   *  - url (String): (Optional) If specified (in place of an identifier), the
   *    specified URL will be requested (either absolute or relative to the
   *    siteUrl defined on the model).
   *
   *  - options (Hash): Options to be passed to the URL.
   *
   * Models may be loaded by either specifying the identifier for the record
   * to be loaded or by URL. The first parameter passed to load should be one
   * or the other.
   *
  **/
  loadCollection: function()
  {
    var url        = false,
        options    = false,
        modelKlass = this;

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

    $L.info("Loading records at URL: " + url + " ...", this.className);

    // var collection = $A();
    var collection = new Aphid.Model.CollectionProxy(options);
    collection.set("isLoading", true);
    collection.set("modelKlass", modelKlass);

    // Request Options
    var requestOptions = {
      method: "GET",
      asynchronous: true,
      contentType: 'application/json',
      onSuccess: this._handleLoadCollectionResponse.bind(this, collection, modelKlass),
      onFailure: this._handleFailureResponse.bind(this, collection, modelKlass),
      onException: function(transport, exception) { throw exception; }
    };

    // Make Request
    new Ajax.Request(url, requestOptions);

    return collection;
  },

  _handleLoadCollectionResponse: function(collection, klass, transport)
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
      collection.push(instance);
    });

    collection.set("isLoaded", true);
    collection.set("isLoading", false);
    collection._afterLoad();
  },

  // Create ------------------------------------------------------------------

  create: function(options)
  {
    var url    = false,
    modelKlass = this;

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
      {
        $L.error("Cannot assemble URL (\"" + url + "\") with missing " + "property".pluralize(missingProperties.size(), "properties") + ": " + missingProperties.join(", "), this.className);
        return;
      }
    }

    // Replace Template Variables in URL
    var template = new Template(url);
    url = template.evaluate(options);

    $L.info("Loading record at URL: " + url + " ...", this.className);

    var instance = new modelKlass(options);
    instance.set("isLoading", true);

    // Remove Internal Options
    options = $H(options);
    options.unset("delegate");

    // Request Options
    var requestOptions = {
      method: "POST",
      asynchronous: true,
      contentType: 'application/json',
      onSuccess: this._handleCreateResponse.bind(this, instance),
      onFailure: this._handleFailureResponse.bind(this, instance),
      onException: function(transport, exception) { throw exception; },
      postBody: Object.toJSON(options)
    };

    // Add the Authenticity Token, if available...
    if (Aphid.Model.Base.authenticityToken)
    {
      requestOptions.requestHeaders = {
        "X-CSRF-Token": Aphid.Model.Base.authenticityToken
      };
    }

    // Make Request
    new Ajax.Request(url, requestOptions);

    return instance;
  },

  _handleCreateResponse: function(instance, transport)
  {
    var object = transport.responseJSON;
    instance._initializeFromObject(object);
    instance.set("isLoaded", true);
    instance.set("isLoading", false);
    instance._afterLoad();
  },

  // -------------------------------------------------------------------------

  _handleFailureResponse: function(instance, transport)
  {
    instance.set("isLoaded", false);
    instance.set("isLoading", false);

    // Post Notification
    instance.postNotification("ModelFailureNotification", transport);

    // Call Delegate Method
    if (instance.get("delegate") && instance.get("delegate").modelDidFailWithError)
      instance.get("delegate").modelDidFailWithError(instance, transport);
  }

};

// Authentication Token ------------------------------------------------------

/**
 * Aphid.Model.Base.authenticityToken -> String | false
**/
Aphid.Model.Base.authenticityToken = false;

// "Inherited" Class Callback ------------------------------------------------

Aphid.Model.Base.inherited = function(subclass)
{
  $L.debug("Inherited by " + subclass.className, "Aphid.Model.Base");

  // Add the Model Class Methods (find, all, etc) to the Subclass
  Object.extend(subclass, Aphid.Model.Base.ClassMethods);
};
