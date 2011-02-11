/**
 * class Aphid.Model.Error
**/

Aphid.Model.Error = Aphid.Class.create("Aphid.Model.Error", {

  field: false,
  message: false,

  initialize: function(message, field)
  {
    this.field = field;
    this.message = message;
  },

  toString: function()
  {
    return this.message;
  },

  toElement: function()
  {
    var element = new Element("li");
    element.update(this.message);
    return element;
  }

});
