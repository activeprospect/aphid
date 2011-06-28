/**
 * class Aphid.Model.CollectionProxy < Aphid.Support.Object
**/

Aphid.Model.CollectionProxy = Aphid.Class.create("Aphid.Model.CollectionProxy", Aphid.Support.Object, {

  isLoaded: false,
  isLoading: false,
  delegate: false,
  collection: false,

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
  }

});

Object.extend(Aphid.Model.CollectionProxy.prototype, Enumerable);
