/**
 * class Aphid.Class < Class
**/

Aphid.Class = {};

/**
 * Aphid.Class.create(name, [parent][, methods...]) -> Class
**/
Aphid.Class.create = function(name)
{
  var arguments = $A(arguments);
  var klass, parent, methods;

  if (arguments[1] && Object.isFunction(arguments[1]))
  {
    parent  = arguments[1];
    if (arguments[2])
    {
      methods = arguments[2];
      klass   = Class.create(parent, methods);
    }
    else
      klass = Class.create(parent);
  }
  else if (arguments[1])
  {
    methods = arguments[1];
    klass   = Class.create(methods);
  }
  else
  {
    klass = Class.create();
  }

  // Set className and displayName Properties
  klass.prototype.displayName = name;
  klass.prototype.className   = name;
  klass.className             = name;

  // Extend Class w/Object Mixin
  // TODO Object.extend(klass.prototype, Aphid.Support.Object);

  // Extend Class w/Properties
  Object.extend(klass.prototype, Aphid.Support.Properties);

  // Notify Parent
  if (parent && Object.isFunction(parent.inherited))
    parent.inherited(klass);

  return klass;
}
