/**
 * class Aphid.Class
**/

Aphid.Class = {};

/**
 * Aphid.Class.create(name[, parent[, methods]]) -> Aphid.Class
**/
Aphid.Class.create = function(name)
{
  var args = $A(arguments);
  var klass, parent, methods;

  if (args[1] && Object.isFunction(args[1]))
  {
    parent = args[1];
    if (args[2])
    {
      methods = args[2];
      klass   = Class.create(parent, methods);
    }
    else
    {
      klass = Class.create(parent);
    }
  }
  else if (args[1])
  {
    methods = args[1];
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

  // Add Debugging Information
  $H(klass.prototype).keys().each(function(key) {
    if (Object.isFunction(klass.prototype[key]) && !klass.prototype[key].displayName)
      klass.prototype[key].displayName = name + "#" + key;
  });

  // Extend Class w/Object Mixin
  // TODO Object.extend(klass.prototype, Aphid.Support.Object);

  // Extend Class w/Properties
  Object.extend(klass.prototype, Aphid.Support.Properties);

  // Notify Parent
  if (parent && Object.isFunction(parent.inherited))
    parent.inherited(klass);

  return klass;
};

Aphid.Class.instanceCounter = 0;
