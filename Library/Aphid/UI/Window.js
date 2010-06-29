//
// Window Object
//
// The Aphid.UI.Window class is essentially a wrapper for managing the current
// application/document <body>.
//

Aphid.UI.Window = Class.create(
  {

    container: false,
    subviews: false,

    initialize: function()
    {
      $L.info('Initializing window…', 'Aphid.UI.Window');
      this.container = $(document.body);
      this.subviews = $A();
    },

    addSubview: function(subview)
    {
      if (Object.isUndefined(subview) || Object.isUndefined(subview.element))
      {
        $L.error("A valid subclass of View was not provided. You must pass an Object to addSubview that returns the DOM structure of the view as the 'element' property of the object.", 'Aphid.UI.Window');
        return;
      }

      $L.info('Adding subview to window…', 'Aphid.UI.Window');
      this.subviews.push(subview);
      this.container.insert(subview.element);
    }

  }
);
