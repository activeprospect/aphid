/**
 * mixin Aphid.Support.Properties
 *
 * This mixin adds support for a common pattern of using accessors and
 * setters to manipulate properties on an object.
 *
 * Any class defined with [[Aphid.Class]] or object that derives from
 * [[Aphid.Support.Object]] will automatically have property support mixed in to
 * it.
 *
**/

Aphid.Support.Properties = {

  /**
   * Aphid.Support.Properties#get(propertyName) -> Object | Boolean | null
   *
   * - propertyName (String): the name of the property whose value should be
   *   returned.
   *
   * Accesses and returns the value of the property specified with the
   * `propertyName` argument.
   *
   * ### Implementing Custom Accessors
   *
   * You may implement a custom accessor that can transform or otherwise
   * operate on the property before returning it by implementing a method
   * named <code>get<em>PropertyName</em></code>, where _PropertyName_ is the
   * name of the property. For example:
   *
   *     firstName: false,
   *     getFirstName: function()
   *     {
   *       return this.firstName.capitalize();
   *     }
   *
   * ### Exceptions
   *
   *  - Attempts to access an undefined property will throw an
   *    `UndefinedPropertyError` exception.
   *
   *  - Attempts to access a property on an object that has not been extended
   *    by [[Aphid.Support.Properties]] will throw an
   *    `ObjectWithoutPropertiesError` exception.
   *
  **/
  get: function(property, options)
  {
    // Handle nested property access
    if (property.indexOf(".") > 0)
    {
      var chainedProperties   = property.split("."),
          thisProperty        = chainedProperties.first(),
          remainingProperties = chainedProperties.slice(1).join(".");

      if (this.get(thisProperty).get)
        return this.get(thisProperty).get(remainingProperties);
      else
        throw this._objectWithoutPropertiesError(thisProperty);
    }

    // Ensure that the property is defined
    if (!this.has(property))
      throw this._undefinedPropertyError(property);

    // Check for Computed Property
    if (Object.isFunction(this[property]))
      return this[property](options);

    // Check for a Custom Accessor
    var customAccessor = "get" + property.upperCaseFirst();
    if (Object.isFunction(this[customAccessor]))
      return this[customAccessor](options);

    // Otherwise, return the property directly...
    return this[property];
  },

  /**
   * Aphid.Support.Properties#set(propertyName, value) -> Object | Boolean | null
   *
   * - propertyName (String): the name of the property whose value should be
   *   set.
   *
   * - value (Object): the new value to set on the property.
   *
   * Sets the value of the property specified with the `propertyName`
   * argument to the value given as the `value` argument.
   *
   * ### Implementing Custom Setters
   *
   * You may implement a custom setter that can transform or otherwise
   * operate on the property before returning it by implementing a method
   * named <code>set<em>PropertyName</em></code>, where _PropertyName_ is the
   * name of the property. For example:
   *
   *     firstName: false,
   *     setFirstName: function(value)
   *     {
   *       this.firstName = value.capitalize();
   *       return this.value;
   *     }
   *
   * ### Exceptions
   *
   *  - Attempts to set an undefined property will throw an
   *    `UndefinedPropertyError` exception.
   *
   *  - Attempts to set a property value on an object that has not been
   *    extended by [[Aphid.Support.Properties]] will throw an
   *    `ObjectWithoutPropertiesError` exception.
   *
  **/
  set: function(property, value)
  {
    // Handle nested property access
    if (property.indexOf(".") > 0)
    {
      var chainedProperties   = property.split("."),
          thisProperty        = chainedProperties.first(),
          remainingProperties = chainedProperties.slice(1).join(".");

      if (this.get(thisProperty).get)
        return this.get(thisProperty).set(remainingProperties, value);
      else
        throw this._objectWithoutPropertiesError(thisProperty);
    }

    // Ensure that the property is defined
    if (!this.has(property))
      throw this._undefinedPropertyError(property);

    // Check for a Custom Setter
    var customSetterName = "set" + property.upperCaseFirst();
    if (Object.isFunction(this[customSetterName]))
      return (this[customSetterName](value));

    // Otherwise, set the property value directly...
    return (this[property] = value);
  },

  /**
   * Aphid.Support.Properties#has(propertyName) -> Boolean
   *
   * - propertyName (String): the name of the property to verify.
   *
   * Checks whether or not the specified `propertyName` has been defined on
   * the object, returning true or false depending on the result.
  **/
  has: function(property)
  {
    return !Object.isUndefined(this[property]);
  },

  // Exceptions --------------------------------------------------------------

  /*
   * Aphid.Support.Properties#_undefinedPropertyError(property) -> Error
   *
   * - property (String): the property that is not defined
   *
   * Returns an Error object stating that the specified +property+ is not
   * defined on the class.
   */
  _undefinedPropertyError: function(property)
  {
    var error  = new Error("Property '" + property + "' is not defined on " + this.displayName);
    error.name = "UndefinedPropertyError";
    return error;
  },

  /*
   * Aphid.Support.Properties#_objectWithoutPropertiesError(property) -> Error
   *
   * - property (String): the property that is not extended by Aphid.Support.Properties
   *
   * Returns an Error object stating that the specified +property+ has not
   * been extended with [[Aphid.Support.Properties]].
   */
  _objectWithoutPropertiesError: function(property)
  {
    var error  = new Error("Property '" + property + "' instance has not been extended by Aphid.Support.Properties on " + this.displayName);
    error.name = "ObjectWithoutPropertiesError";
    return error;
  }

};
