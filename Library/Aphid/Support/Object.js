/**
 * class Aphid.Support.Object
 *
**/

//= require <Aphid/Support/Properties>

Aphid.Support.Object = Class.create({

  /**
   * Aphid.Support.Object#delegate -> Object
   *
   * An object that will receive calls for delegate methods of this class.
  **/
  delegate: false

});

// Mixins --------------------------------------------------------------------

Object.extend(Aphid.Support.Object.prototype, Aphid.Support.Properties);
