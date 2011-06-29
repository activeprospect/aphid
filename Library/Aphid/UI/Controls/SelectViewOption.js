/**
 * class Aphid.UI.Controls.SelectViewOption < Aphid.UI.View
 *
**/

Aphid.UI.Controls.SelectViewOption = Aphid.Class.create("Aphid.UI.Controls.SelectViewOption", Aphid.UI.View, {

  tagName: "li",

  /**
   * Aphid.UI.Controls.SelectViewOption#selectView -> Aphid.UI.Controls.SelectView
   *
   * The [[Aphid.UI.Controls.SelectView]] instance that this option belongs to.
  **/
  selectView: false,

  /**
   * Aphid.UI.Controls.SelectViewOption#label -> String | false
   *
   * The displayed label of the option.
  **/
  label: false,

  /**
   * Aphid.UI.Controls.SelectViewOption#value -> String | false
   *
   * The internal value of the option.
  **/
  value: false,

  /**
   * new Aphid.UI.Controls.SelectViewOption([options])
   *
   * - options (Hash): Initial property values to be set on the
   *   SelectViewOption instance
   *
   * Initializes a new SelectViewOption instance.
  **/
  initialize: function($super, options)
  {
    if (options && !Object.isUndefined(options.element))
    {
      var element = options.element;
      if (Object.isUndefined(options.label))
        options.label = element.innerHTML;
      if (Object.isUndefined(options.value))
        options.value = element.readAttribute("value");
      options.element = false;
    }

    $super(options);
  },

  setLabel: function(label)
  {
    this.label = label;
    this.get("element").update(label);
    return label;
  },

  setValue: function(value)
  {
    this.value = value;
    this.get("element").setData("value", value);
    return value;
  }

});
