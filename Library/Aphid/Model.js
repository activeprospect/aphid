/**
 * class Aphid.Model
 *
 * An abstract class that provides basic functionality for models that, when
 * subclassed, makes loading and initializing model objects simple and
 * consistent.
 *
 * ### Defining Custom Models
 *
 * _Document Me!_
 *
 * ### Loading Models Asynchronously with JSON
 *
 * _Document Me!_
 *
 * ### Initializing Models from Objects (JSON, Hash, ...)
 *
 * _Document Me!_
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
 *     var contact = new Contact($('contact_123'));
 *     contact.name; // John Doe
 * 
**/

/* TODO Finish this
 * ### Delegate Methods
 *
 * While it's not typical to have a delegate for your model, in cases where
 * asynchronous loading or other operations are taking place it can be useful
 * to be notified when various state changes occur.
 * 
 *  * `modelDidFinishLoading(model)` - This method is called when the model
 *    has finished loading and is fully initialized after an asynchronous
 *    load operation.
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
   * Aphid.Model#attributes -> Array
   *
   * An array of all possible attribute names that instances of the model will
   * contain. When initializing the object from another object, JSON string,
   * or HTML element (using data-* attributes), these attribute names will be
   * referenced to set values from the initialization data.
  **/
  attributes: [],

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
  proxies: {},

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
   * new Aphid.Model([values])
   *
   * - values (Element | JSON | Object): The values to initialize the model
   *   instance with.
  **/
  initialize: function(values)
  {
    if (Object.isUndefined(values) || !values) return;

    if ((values + "").match(/^[A-Za-z0-9]+$/))
    {
      $L.info('Loading Remotely with Identifier: ' + values);
      this.loadRemotelyWithIdentifier(values);
    }

    // Initialize with an HTML or JSON String
    else if (Object.isString(values))
    {
      string = values.trim();
      if (string.charAt(0) == '<')
      {
        $L.info('Initializing from an HTML String...');
        this.initializeWithElement(Element.fromString(string));
      }
      else
      {
        $L.info('Initializing from a JSON String...');
        this.initializeWithObject(string.evalJSON());
      }
    }

    // Initialize with an Element
    else if (Object.isElement(values))
    {
      $L.info('Initializing from an HTML Element...');
      this.initializeWithElement(values);
    }

    // Initialize with a Hash or a Hash-like Object
    else
    {
      $L.info('Initializing from a Hash or Object...');
      this.initializeWithObject(values);
    }

    this._instantiateProxies();
  },

  initializeWithObject: function(object)
  {
    this.attributes.each(
      function(attribute)
      {
        $L.debug('Setting value of attribute "' + attribute + '" to "' + object[attribute] + '"');
        this[attribute] = object[attribute];
      }.bind(this)
    )
  },

  initializeWithElement: function(element)
  {
    this.attributes.each(
      function(attribute)
      {
        $L.debug('Setting value of attribute "' + attribute + '" to "' + element.getAttribute('data-' + attribute) + '"');
        this[attribute] = element.getAttribute('data-' + attribute);
      }.bind(this)
    )
  },

  // Remote Loading ----------------------------------------------------------

  /**
   * Aphid.Model#loadRemotelyWithIdentifier(identifier) -> null
   *
   * - identifier (String | Number): the string or numeric identifier of the
   *   record that should be loaded.
   *
   * Sends an asynchronous request to the URL configured as baseURL along with
   * the specified identifier.
  **/
  loadRemotelyWithIdentifier: function(identifier)
  {
    var url = this.baseURL + identifier;
    var options = {
      method: 'get',
      contentType: 'application/json',
      onSuccess: function(transport)
      {
        this.initializeWithObject(transport.responseJSON);
        this.isLoaded = true;
      }.bind(this)
    };
    new Ajax.Request(url, options);
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
   * Instantiates a proxy.
  **/
  _instantiateProxy: function(proxy)
  {
    var attribute = proxy[0],
        klass     = proxy[1];
    this[attribute] = new klass(this[attribute]);
  },

  // -------------------------------------------------------------------------

  /**
   * Aphid.Model#toTemplateReplacements -> Hash
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
