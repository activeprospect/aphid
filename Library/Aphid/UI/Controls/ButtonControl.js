/**
 * class Aphid.UI.Controls.ButtonControl < Aphid.UI.Control
 *
 * ### Example
 *
 *     <button data-view-class="Aphid.UI.Controls.ButtonControl">
 *       Open
 *     </ul>
 *
**/

Aphid.UI.Controls.ButtonControl = Class.create(Aphid.UI.Control, {

  displayName: "Aphid.UI.Controls.ButtonControl",

  /**
   * Aphid.UI.Controls.ButtonControl#isToggle -> Array
   *
   * If true, the button will act as a toggle button.
  **/
  isToggle: false,

  /**
   * Aphid.UI.Controls.ButtonControl#isOn -> Array
   *
   * If true, the button is currently in a toggled "on" state.
  **/
  isOn: false,

  // Event Handlers ----------------------------------------------------------

  handleMouseUpEvent: function(event, element)
  {
    if (this.isOn)
    {
      this.set("isOn", false);
      this.get("element").removeClassName("on");
    }
    else
    {
      this.set("isOn", true);
      this.get("element").addClassName("on");
    }
  }

});
