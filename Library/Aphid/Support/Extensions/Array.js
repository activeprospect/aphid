/**
 * Aphid.Support.Extensions.Array
 *
 * Extensions to the core JavaScript Array implementation.
 *
**/
Aphid.Support.Extensions.Array = {

  /**
   * Aphid.Support.Extensions.Array#random() -> Array
   *
   * Returns the array with its contents rearranged in random order.
  **/
  random: function()
  {
    return this[parseInt(Math.random() * this.length)];
  }

}

Object.extend(Array.prototype, Aphid.Support.Extensions.Array);
