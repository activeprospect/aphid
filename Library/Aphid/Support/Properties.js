/**
 * mixin Aphid.Support.Properties
 *
 * This mixin adds support for a common pattern of using accessors and
 * setters.
 *
 * Because Internet Explorer does not support custom properties on
 * any objects but DOM objects (and only then on Internet Explorer 8),
 * we must implement our own getter/setter methods in order to support
 * IE.
**/

Aphid.Support.Properties = {

  /**
   * Aphid.Support.Properties#get(property) -> Object
   *
   * - property (String): name of the property that should be retrieved
    *
    * Gets the value of the specified +property+. This method will check for a
    * get_PropertyName_ method definition and will call it, if present.
   **/
  get: function(property)
  {
    if (!this.hasProperty(property))
      throw this._undefinedPropertyError(property);

    // Check for Computed Property
    if (Object.isFunction(this[property]))
      return this[property]();

    // Check for a Custom Accessor
    var customAccessor = "get" + property.upperCaseFirst();
    if (this[customAccessor])
      return this[customAccessor]();

    // Otherwise, return the property directly...
    return this[property];
  },

  /**
   * Aphid.Support.Properties#set(property, value) -> Object
   *
   * - property (String): the name of the property whose value should be set
   * - value (Object): the object to set as the value of the property
   *
   * Sets the specified +property+ to the provided +value+, returning the
   * +value+ upon success. This method will check for a set_PropertyName_
   * method definition and will call it, if present.
  **/
  set: function(property, value)
  {
    if (!this.hasProperty(property))
      throw this._undefinedPropertyError(property);

    // Check for Computed Property
    if (Object.isFunction(this[property]))
      throw this._readOnlyPropertyError(property);

    // Check for a Custom Setter
    var customSetterName = "set" + property.upperCaseFirst();
    if (this[customSetterName])
      return this[customSetterName](value)

    return this[property] = value;
  },

  /**
   * Aphid.Support.Properties#hasProperty(property) -> Boolean
   *
   * Returns true or false depending on whether or not the object has the
   * specified +property+ defined.
  **/
  hasProperty: function(property)
  {
    return !Object.isUndefined(this[property]);
  },

  // -------------------------------------------------------------------------

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
   * Aphid.Support.Properties#_readOnlyPropertyError(property) -> Error
   *
   * - property (String): the property that is read-only
   *
   * Returns an Error object stating that the specified +property+ is
   * read-only or a computed property.
   */
  _readOnlyPropertyError: function(property)
  {
    var error  = new Error("Property '" + property + "' is read-only (or computed) on " + this.displayName);
    error.name = "ReadOnlyPropertyError";
    return error;
  }


};
