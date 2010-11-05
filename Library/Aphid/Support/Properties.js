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

  UndefinedPropertyError: {
    name: "UndefinedPropertyError",
    message: "The specified property does not exist"
  },

  /**
   * Aphid.Support.Properties#get(property) -> Object
   *
   * - property (String): name of the property that should be retrieved
   *
  **/
  get: function(property)
  {
    if (Object.isUndefined(this["_" + property]))
      throw this.UndefinedPropertyError
      // throw("Unknown property '" + property + "'")

    // Check for a Custom Accessor
    var customAccessor = "get" + property.upperCaseFirst();
    if (this[customAccessor])
      return this[customAccessor];

    // Otherwise, return the property directly...
    return this["_" + property];
  },

  /**
   * Aphid.Support.Properties#set(property, value) -> Object
   *
  **/
  set: function(property, value)
  {
    if (Object.isUndefined(this["_" + property]))
      throw this.UndefinedPropertyError
      // throw("Unknown property '" + property + "'")

    // Check for a Custom Setter
    var customSetterName = "set" + property.upperCaseFirst();
    if (this[customSetterName])
      return this[customSetterName](value)

    return this["_" + property] = value;
  }

};
