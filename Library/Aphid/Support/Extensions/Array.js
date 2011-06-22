/**
 * mixin Aphid.Support.Extensions.Array
 *
 * Extensions to the core JavaScript Array implementation.
 *
**/
Aphid.Support.Extensions.Array = {

  /**
   * Aphid.Support.Extensions.Array#compare(otherArray) -> Boolean
   *
   * - otherArray (Array): the array to compare with
   *
   * Compares the array against another array, returning true if the arrays
   * are identical.
  **/
  compare: function(otherArray)
  {
    if (Object.isUndefined(otherArray)) return false;
    if (otherArray === null) return false;
    if (this.length != otherArray.length) return false;
    for (var i = 0; i < otherArray.length; i++)
    {
      if (this[i].compare)
        return this[i].compare(otherArray[i]);
      else if (this[i] !== otherArray[i])
        return false;
    }
    return true;
  },

  /**
   * Aphid.Support.Extensions.Array#random() -> Object
   *
   * Returns a random element from the array.
  **/
  random: function()
  {
    return this[parseInt(Math.random() * this.length, 10)];
  },

  /**
   * Aphid.Support.Extensions.Array#randomize() -> Array
   *
   * Returns the array with its contents rearranged in random order.
  **/
  randomize: function()
  {
    for (var rnd, tmp, i = this.length; i; rnd = parseInt(Math.random() * i, 0), tmp = this[--i], this[i] = this[rnd], this[rnd] = tmp);
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
  },

  /**
   * Aphid.Support.Extensions.Array#insert(index, object[, object]) -> Object | false
   *
   * - index (Integer): 
   * - object (Object): 
  **/
  insert: function(index)
  {
    this.length = Math.max(this.length, index);
    index = index < 0 ? this.length : index;
    this.splice.apply(this, [index, 0].concat(Array.prototype.slice.call(arguments, 1)));
    return this;
  },

  /**
   * Aphid.Support.Extensions.Array#sum() -> Number
   *
   * Iterates an Array of numbers, returning the sum of those numbers.
  **/
  sum: function()
  {
  	for (var i = 0, sum = 0; i < this.length; sum += this[i++]);
  	return sum;
  }

};

Object.extend(Array.prototype, Aphid.Support.Extensions.Array);
