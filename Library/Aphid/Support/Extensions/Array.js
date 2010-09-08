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
  },

  /**
   * Aphid.Support.Extensions.Array#remove(item) -> Object | false
   *
   * - item (Object): the item to be removed from the array.
   *
   * Removes an item from the array without cloning the array. If the item was
   * not found in the array, false will be returned. This is essentially a
   * wrapper for Array#splice.
  **/
  remove: function(item)
  {
    var itemIndex = this.indexOf(item);
    if (itemIndex == -1)
      return false;
    else
      return this.splice(itemIndex, 1);
  }

}

Object.extend(Array.prototype, Aphid.Support.Extensions.Array);
