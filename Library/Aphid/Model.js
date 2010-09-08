/**
 * class Aphid.Model
 *
 * An abstract class that provides basic functionality for models that, when
 * subclassed, makes loading and initializing model objects simple and
 * consistent.
 *
 * ### Custom Models
 *
 * To create a custom model, you will need to subclass [[Aphid.Model]] and
 * define at least two properties: [[Aphid.Model#attributes]] and
 * [[Aphid.Model#url]].
 *
 * #### Example
 *
 *     var Contact = Class.create(Aphid.Model, {
 *       url: "http://example.com/contacts?id=#{identifier}",
 *       attributes: [ "name", "email" ]
 *     });
 *
 * You may also wish to implement custom proxies to initialize certain
 * attributes of the model as an instance of a specific class. See
 * [[Aphid.Model#proxies]] for more information on their usage.
 *
 * ### URL Formats
 *
 * The [[Aphid.Model#url]] attribute supports string interpolation so that you
 * may customize where in the URL the record identifier is injected. Your URL
 * must include `#{identifier}` at the point that you wish to add the record
 * identifier:
 *
 *     url: "http://example.com/contacts/#{identifier}?option=foo"
 *
 * ### Loading & Initializing Models from Web Service by Identifier
 *
 * Typically, you will want to initialize your model by loading its attributes
 * from a remote web service by a unique identifier. To do this, you must
 * first define the [[Aphid.Model#url]] property on the model definition.
 * Then you may simply pass in an identifier key to the initializer with the
 * id of the record to be loaded.
 *
 * #### Example
 *
 *     // Load by a numerical identifier
 *     var contact = new Contact({ identifier: 123 });
 *     // ... or a string identifier
 *     var contact = new Contact({ identifier: '8iCuNscVT2yzBc13aMjySrBVCfF' });
 *
 * #### Model "Loaded" State
 *
 * Since models are loaded asynchronously when loaded by an identifier, it is
 * important to monitor the model's load state before attempting to access its
 * properties or operate on the object.
 *
 * The [[Aphid.Model#isLoaded]] instance property is a boolean attribute that
 * denotes whether or not the model has been fully loaded or not. You may need
 * to check this property before operating on the model to ensure that you are
 * working with a fully initialized instance of the model and retry your
 * operation with a timer if it is still loading.
 *
 * #### Delegate Notifications of Load State Changes
 *
 * Alternatively, you may implement the `modelDidFinishLoading` method in your
 * delegate and assign the delegate to your model during initialization.  implementingobject
 * in the class responsible for loading the model and assign the object that
 * implements the method during initialization as the delegate for the model:
 *
 *     var ContactController = Class.create(Aphid.UI.ViewController, {
 *       contact: false,
 *       viewDidLoad: function()
 *       {
 *         this.contact = new Contact(123);
 *       },
 *       modelDidFinishLoading: function(model)
 *       {
 *         this.displayContact();
 *       }
 *     });
 *
 * ### Initializing Models from JSON
 *
 * If you already have a JSON string that represents the serialized state of
 * your model, you may initialize it by specifying it as the value of the
 * `json` parameter during initialization.
 *
 * #### Example
 *
 *     var contactJSON = '{"name":"John Doe","email":"jdoe@example.com"}';
 *     var contact = new Contact({ json: contactJSON });
 *     contact.name; // John Doe
 *
 * ### Initializing Models from Objects
 *
 * If you already have an object, such as a hash, that represents the
 * serialized state of your model, you may initialize it by specifying it as
 * the value of the `object` parameter during initialization.
 *
 * This can be useful if you wish to initialize a new instance of an existing
 * record, but wish to change a few attributes to make it unique before you
 * save it.
 *
 * #### Example
 *
 *     var contactAttributes = {
 *       name: "John Doe",
 *       email: "jdoe@example.com"
 *     };
 *     var contact = new Contact({ object: contactAttributes });
 *     contact.name; // John Doe
 *
 * ### Initializing Models from HTML
 *
 * Another method of initializing a model is from an HTML element that
 * specifies its attributes using HTML5 data attributes (_data-*_). You may
 * initialize a model from either an HTML string or an Element instance.
 *
 * This can be useful when you are initializing from a statically-generated
 * page.
 *
 * #### Example
 *
 *     // <div id="contact_123" data-name="John Doe" data-email="jdoe@example.com">
 *     //   John Doe - <a href="mailto:jdoe@example.com">jdoe@example.com</a>
 *     // </div>
 *     var contact = new Contact({ element: $('contact_123') });
 *     contact.name; // John Doe
 *
 * ### Callback Methods
 *
 *  * `afterLoad()` - Called immediately after a successful load operation.
 *
 *  * `afterReload()` - Called immediately after a successful reload operation.
 *
 *  * `afterSave()` - Called immediately after a successful save operation.
 *
 * ### Delegate Methods
 *
 * While it's not typical to have a delegate for your model, in cases where
 * asynchronous loading or other operations are taking place it can be useful
 * to be notified when various state changes occur.
 *
 *  * `modelDidFinishLoading(model)` - Called when the model has finished
 *    loading and is fully initialized after an asynchronous load operation.
 *
 *  * `modelDidFinishReloading(model)` - Called when the model has finished
 *    reloading.
 *
 *  * `modelDidFinishSaving(model)` - Called when the model has successfully
 *    saved any changes to the remote web service.
 *
**/

Aphid.Model = Class.create({

  /**
   * Aphid.Model#delegate -> Object
   *
   * An object that will receive calls for delegate methods of this class.
  **/
  delegate: false,

  /**
   * Aphid.Model#url -> Object
   *
   * The URL template to be used when loading model objects remotely by a
   * record identifier. This string must include `#{identifier}` at the point
   * where the identifier should be placed.
   *
   * #### Example
   *
   *     "http://example.com/contacts/#{identifier}?option=foo"
   *
  **/
  url: false,

  /**
   * Aphid.Model#identifier -> String | Integer | false
   *
   * The unique identifier that represents the record for this model instance.
   * If an identifier is specified during initialization, it will be retrieved
   * from the remote server that has been configured for this model class.
  **/
  identifier: false,

  /**
   * Aphid.Model#identifierAttribute -> String | false
   *
   * Defines the name of the attribute that serves as the identifier for the
   * model instance. If specified, [[Aphid.Model#identifier]] will
   * automatically be set to the value of the defined attribute when the model
   * is initialized.
  **/
  identifierAttribute: false,

  /**
   * Aphid.Model#element -> Element | false
   *
   * The HTML Element that the instance was initialized with, or false if
   * the instance was not initialized from an Element.
  **/
  element: false,

  /**
   * Aphid.Model#object -> Element | false
   *
   * The object (i.e. a hash or an existing instance of this model class) that
   * the instance was initialized with, or false if the instance was not
   * initialized from an existing object.
  **/
  object: false,

  /**
   * Aphid.Model#json -> Element | false
   *
   * The JSON string that the instance was initialized with, or false if the
   * instance was not initialized from JSON.
  **/
  json: false,

  /**
   * Aphid.Model#attributes -> Array
   *
   * An array of all possible attribute names that instances of the model will
   * contain. When initializing the object from another object, JSON string,
   * or HTML element (using data-* attributes), these attribute names will be
   * referenced to set values from the initialization data.
  **/
  attributes: $A(),

  /**
   * Aphid.Model#proxies -> Hash
   *
   * Proxies allow you to specify the name of a class that should be
   * initialized with the value of the attribute. This is useful if you are
   * initializing an instance of a model from a JSON object that contains the
   * attributes for related classes.
   *
   * ### Example
   *
   * Lets say we have a Contact model that contains 3 attributes: _name_,
   * _email_ and _address_. _Name_ and _email_ are simple string attributes,
   * but what if we want _address_ to be an instance of the Address class? To
   * accomplish this, we would first define our models as so:
   *
   *     var Address = Class.create(Aphid.Model, {
   *       attributes: [ "street", "city", "state", "zip" ],
   *       toString: function() {
   *         return this.street + "\n" + this.city + ", " + this.state + " " + this.zip;
   *       }
   *     });
   *     var Contact = Class.create(Aphid.Model, {
   *       attributes: [ "name", "email", "address" ],
   *       proxies: { address: Address }
   *     });
   *
   * Now we can pass in a Hash as the value to the address attribute and
   * the Contact model will automatically initialize a new instance of Address
   * using the provided Hash:
   *
   *     var contact = new Contact({
   *       name: "John Doe",
   *       email: "jdoe@example.com",
   *       address: {
   *         street: "123 Sample Street",
   *         city: "Anytown",
   *         state: "TX",
   *         zip: 12345
   *       }
   *     })
   *
   * The _address_ attribute on the Contact model will now return an instance
   * of the Address class:
   *
   *     contact.address.toString();
   *     // "123 Sample Street
   *     //  Anytown, TX 12345"
   *
  **/
  proxies: $H(),

  /**
   * Aphid.Model#isLoaded -> Boolean
   *
   * Denotes whether the model has been fully loaded and innitialized. Since
   * the loading of model data can happen asynchronously, this attribute may
   * be referenced and monitored to know when the model has finished loading.
  **/
  isLoaded: false,

  // -------------------------------------------------------------------------

  /**
   * new Aphid.Model([options])
   *
   * - options (Hash): Initial property values to be set on the Model instance
  **/
  initialize: function(options)
  {
    Object.applyOptionsToInstance(this, options);

    if (this.identifier)
      this._initializeFromIdentifier();
    else if (this.element)
      this._initializeFromElement();
    else if (this.object)
      this._initializeFromObject();
    else if (this.json)
      this._initializeFromJSON();
    else
      this._initializeEmptyObject();
  },

  /*
   * Aphid.Model#_initializeFromIdentifier() -> null
   *
   * Initializes the instance by attempting to load the record from a remote
   * datasource using the identifier provided as an option during
   * initialization.
   *
   * Implement the delegate methods `modelDidFinishLoading` to be notified
   * when the model has been completely initialized.
   *
   * TODO Implement error handling for when the request fails
  **/
  _initializeFromIdentifier: function()
  {
    $L.info("Initializing from Record Identifier...", "Aphid.Model");

    // Assemble URL
    var urlTemplate = new Template(this.url);
    var url = urlTemplate.evaluate({ identifier: this.identifier });

    // TODO Error handling for when the string did not have any variables

    // Request Options
    var options = {
      method: 'get',
      contentType: 'application/json',
      onSuccess: function(transport)
      {
        this.object = transport.responseJSON;
        this._initializeFromObject();
        this.isLoaded = true;
        this._afterLoad();
      }.bind(this),
      onFailure: function(transport)
      {
        var alertView = new Aphid.UI.AlertView();
        alertView.title = "Error Loading Resource";
        alertView.message = "Failed to load an instance of <strong>" + this.displayName + "</strong> using the identifier: <strong>" + this.identifier + "</strong>";
        alertView.status = "Error " + transport.status + " - " + transport.statusText;
        alertView.showAnimated();
      }.bind(this)
    };

    // Make Request
    new Ajax.Request(url, options);
  },

  /*
   * Aphid.Model#_initializeFromElement() -> null
   *
   * Initializes the instance from the HTML Element provided as an option
   * during initialization.
  **/
  _initializeFromElement: function()
  {
    $L.info("Initializing from Element...", "Aphid.Model");
    if (Object.isString(this.element))
      this.element = Element.fromString(this.element);
    this.attributes.each(
      function(attribute)
      {
        $L.debug('Setting value of attribute "' + attribute + '" to "' + this.element.getData(attribute) + '"');
        this[attribute] = this.element.getData(attribute);
        this["_" + attribute] = this.element.getData(attribute);
      }.bind(this)
    );
    if (this.identifierAttribute && !this.identifier && this[this.identifierAttribute])
    {
      $L.debug('Setting identifier to ' + this[this.identifierAttribute] + '"');
      this.identifier = this[this.identifierAttribute];
    }
    this._instantiateProxies();
  },

  /*
   * Aphid.Model#_initializeFromObject() -> null
   *
   * Initializes the instance from a JavaScript object by applying any of the
   * attributes for this model that are found in the object to the instance.
  **/
  _initializeFromObject: function()
  {
    $L.info("Initializing from Object...", "Aphid.Model");
    this.attributes.each(
      function(attribute)
      {
        $L.debug('Setting value of attribute "' + attribute + '" to "' + this.object[attribute] + '"');
        this[attribute] = this.object[attribute];
        this["_" + attribute] = this.object[attribute];
      }.bind(this)
    );
    if (this.identifierAttribute && !this.identifier && this[this.identifierAttribute])
    {
      $L.debug('Setting identifier to ' + this[this.identifierAttribute] + '"');
      this.identifier = this[this.identifierAttribute];
    }
    this._instantiateProxies();
  },

  /*
   * Aphid.Model#_initializeFromJSON() -> null
   *
   * Initializes the instance from the JSON string provided as an option
   * during initialization by first evaluating the string and then passing it
   * on to [[Aphid.Model#_initializeFromObject()]].
  **/
  _initializeFromJSON: function()
  {
    $L.info("Initializing from JSON...", "Aphid.Model");
    this.object = this.json.evalJSON();
    this._initializeFromObject();
  },

  /*
   * Aphid.Model#_initializeEmptyObject() -> null
   *
   * Initializes an empty instance with each attribute set to null.
  **/
  _initializeEmptyObject: function()
  {
    $L.info("Initializing empty object...", "Aphid.Model");
    this.attributes.each(
      function(attribute)
      {
        this[attribute] = null;
        this["_" + attribute] = null;
      }.bind(this)
    );
  },

  // Dirty State Tracking ----------------------------------------------------

  /**
   * Aphid.Model#isDirty() -> Boolean
   *
   * Iterates the attributes of the model instance and checks for any changes
   * from the initialized state, returning true if any of the attribute values
   * have changed.
   *
   * This method also looks at all proxied objects that *do not* have an
   * identifier, that is to say, proxies that are instantiated from a parent
   * object that do not have their own identifier and cannot be loaded or
   * saved on their own.
  **/
  isDirty: function()
  {
    var isDirty = false;

    this.attributes.each(function(attribute)
    {
      if (this.proxies && $H(this.proxies).keys().include(attribute))
      {
        if (Object.isArray(this[attribute]))
        {
          if (this[attribute].length != this["_" + attribute].length)
            isDirty = true;
          else
            this[attribute].each(function(proxyAttribute) {
              if (!proxyAttribute.identifier && proxyAttribute.isDirty())
                isDirty = true;
            }, this);
        }
      }
      else if (this[attribute] != this["_" + attribute])
        isDirty = true;
    }, this);

    return isDirty;
  },

  // Proxies -----------------------------------------------------------------

  /*
   * Aphid.Model#_instantiateProxies() -> null
   *
   * Instantiates any configured proxies on the model instance.
  **/
  _instantiateProxies: function()
  {
    $H(this.proxies).each(this._instantiateProxy, this);
  },

  /*
   * Aphid.Model#_instantiateProxy(proxy) -> null
   *
   * - proxy (Hash): a key/value pair containing the attribute (as the key)
   *   and the class to be instantiated (as the value).
   *
   * Instantiates a new instance of the configured class for the given
   * proxy (attribute). If the attribute's value is an array, each element of
   * the array will be instantiated as the configured proxy class.
  **/
  _instantiateProxy: function(proxy)
  {
    var attribute = proxy[0],
        klass     = proxy[1];
    if (Object.isArray(this[attribute]))
      this[attribute] = this[attribute].collect(function(tuple) {
        var instance = new klass({ object: tuple })
        return instance;
      });
    else
      this[attribute] = new klass({ object: this[attribute] });
  },

  // -------------------------------------------------------------------------

  /**
   * Aphid.Model#serialize() -> Hash
   *
   * Returns a Hash containing the keys and values that make up the instance
   * attributes for the model. This Hash is suitable for initializing another
   * instance of the model or to convert to JSON for transport to a remote
   * web service.
  **/
  serialize: function()
  {
    var attributes = {};

    this.attributes.each(function(attribute)
    {
      // Undefined Properties
      if (Object.isUndefined(this[attribute]) || this[attribute] == null)
        attributes[attribute] = "";

      // Arrays (Values, Model Relationships, etc)
      else if (Object.isArray(this[attribute]))
      {
        attributes[attribute] = this[attribute].collect(
          function(tuple) {
            return Object.isUndefined(tuple.serialize) ? tuple : tuple.serialize()
          }
        );
      }

      // Model Relationships
      else if (this[attribute].serialize)
        attributes[attribute] = this[attribute].serialize();

      // Simple Value
      else
        attributes[attribute] = this[attribute];
    }, this);

    return attributes;
  },

  /**
   * Aphid.Model#save() -> null
  **/
  save: function()
  {
    $L.info("Saving...", this.displayName);

    // Assemble URL
    var urlTemplate = new Template(this.url);
    // TODO Make the identifier field configurable
    var url = urlTemplate.evaluate({ identifier: this.key });

    // TODO Error handling for when the string did not have any variables

    // Request Options
    var options = {
      method: 'POST',
      requestHeaders: { "X-HTTP-Method-Override": "PUT" },
      contentType: 'application/json',
      postBody: Object.toJSON(this.serialize()),
      onSuccess: function(transport)
      {
        this.object = transport.responseJSON;
        this._initializeFromObject();
        this._afterSave();
      }.bind(this),
      onFailure: function(transport)
      {
        var alertView = new Aphid.UI.AlertView();
        alertView.title = "Error Saving Resource";
        alertView.message = "Failed to save <strong>" + this.displayName + "</strong> with identifier: <strong>" + this.key + "</strong>";
        alertView.status = "Error " + transport.status + " - " + transport.statusText;
        alertView.showAnimated();
      }.bind(this)
    };

    // Make Request
    new Ajax.Request(url, options);
  },

  reload: function()
  {
    $L.info("Reloading " + this.displayName + " with identifier " + this.identifier);

    // TODO Make the loading logic common between initialization and reloading

    // Assemble URL
    var urlTemplate = new Template(this.url);
    var url = urlTemplate.evaluate({ identifier: this.identifier });

    // Request Options
    var options = {
      method: 'get',
      asynchronous: false,
      contentType: 'application/json',
      onSuccess: function(transport)
      {
        this.object = transport.responseJSON;
        this._initializeFromObject();
        this._afterReload();
      }.bind(this),
      onFailure: function(transport)
      {
        var alertView = new Aphid.UI.AlertView();
        alertView.title = "Error Reloading Resource";
        alertView.message = "Failed to reload an instance of <strong>" + this.displayName + "</strong> using the identifier: <strong>" + this.identifier + "</strong>";
        alertView.status = "Error " + transport.status + " - " + transport.statusText;
        alertView.showAnimated();
      }.bind(this)
    };

    // Make Request
    new Ajax.Request(url, options);
  },

  // Callbacks ---------------------------------------------------------------

  _afterLoad: function()
  {
    if (this.afterLoad)
      this.afterLoad(this);
    if (this.delegate && this.delegate.modelDidFinishLoading)
      this.delegate.modelDidFinishLoading(this);
  },

  _afterReload: function()
  {
    if (this.afterReload)
      this.afterReload(this);
    if (this.delegate && this.delegate.modelDidFinishReloading)
      this.delegate.modelDidFinishReloading(this);
  },

  _afterSave: function()
  {
    if (this.afterSave)
      this.afterSave(this);
    if (this.delegate && this.delegate.modelDidFinishSaving)
      this.delegate.modelDidFinishSaving(this);
  },

  // -------------------------------------------------------------------------

  /**
   * Aphid.Model#toTemplateReplacements() -> Hash
   *
   * Returns a Hash suitable for use with Prototype's Template and string
   * interpolation functionality.
  **/
  toTemplateReplacements: function()
  {
    var attributes = {};
    this.attributes.each(
      function(attribute)
      {
        attributes[attribute] = this[attribute];
      }.bind(this)
    );
    return attributes;
  }

});
