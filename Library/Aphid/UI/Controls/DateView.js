/**
 * class Aphid.UI.Controls.DateView < Aphid.UI.View
 *
**/

Aphid.UI.Controls.DateView = Class.create(Aphid.UI.View, {

  displayName: "Aphid.UI.Controls.DateView",

  // Properties
  popoverView: false,
  calendarView: false,

  dateFormat: "%Y-%mm-%dd",

  // -------------------------------------------------------------------------

  getCalendarView: function()
  {
    if (!this.calendarView)
      this.calendarView = new Aphid.UI.CalendarView({ delegate: this });

    return this.calendarView;
  },
 
  getPopoverView: function()
  {
    if (!this.popoverView)
      this.popoverView = new Aphid.UI.PopoverView({ delegate: this });

    return this.popoverView;
  },
 
  // Event Handlers ----------------------------------------------------------

  handleFocusEvent: function(event, element)
  {
    if (!this.get("calendarView.superview"))
      this.get("popoverView").setView(this.get("calendarView"));

    this.get("popoverView").presentRelativeToView(this);
  },

  handleBlurEvent: function(event, element)
  {
    if (element != this.get("element") && !element.descendantOf(this.get("popoverView.element")))
      this.get("popoverView").removeFromSuperviewAnimated();
  },

  // Calendar View Delegates -------------------------------------------------

  calendarViewDateDidChange: function(calendarView, date)
  {
    // TODO This is getting called twice...
    if (date)
    {
      this.get("element").value = date.strftime(this.get("dateFormat"));
      $L.info("Selected date " + date + " ... ", this);
    }
  }

});
