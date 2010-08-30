Aphid.Support.Extensions.Vendor.Prototype.BrowserFeatures = {

  /**
   * Prototype.BrowserFeatures.HTML5StructuralElements -> Boolean
  **/
  HTML5StructuralElements: function() {
    var element = document.createElement("div");
    element.innerHTML = "<section></section>";
    if (element.innerHTML.length == 0)
      return false;
    else
      return true;
  }

};

Object.extend(Prototype.BrowserFeatures, Aphid.Support.Extensions.Vendor.Prototype.BrowserFeatures);
