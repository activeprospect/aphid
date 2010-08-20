/**
 * mixin Aphid.Support.Extensions.Array
 *
 * Extensions to the core JavaScript Array implementation.
 *
**/
Aphid.Support.Extensions.Array = {

  /**
   * Aphid.Support.Extensions.Array#random() -> Object
   *
   * Returns a random element from the array.
  **/
  random: function()
  {
    return this[parseInt(Math.random() * this.length)];
  },

  /**
   * Aphid.Support.Extensions.Array#randomize() -> Array
   *
   * Returns the array with its contents rearranged in random order.
  **/
  randomize: function()
  {
    for (var rnd, tmp, i = this.length; i; rnd = parseInt(Math.random() * i), tmp = this[--i], this[i] = this[rnd], this[rnd] = tmp);
  }

}

Object.extend(Array.prototype, Aphid.Support.Extensions.Array);
