/**
 * class Aphid.UI.CalendarView < Aphid.UI.View
 *
 * #### Delegate Methods
 *
 *  * `calendarViewDateDidChange(calendarView, date)`
 *
 * #### Callback Methods
 *
 *  * `didSelectDate(date)`
 *
**/

Aphid.UI.CalendarView = Class.create(Aphid.UI.View, {

  /**
   * Aphid.UI.CalendarView#date -> Date | false
   *
   * The current date.
  **/
  date: false,

  // Initialization ----------------------------------------------------------

  initialize: function($super, options)
  {
    $super(options);
    if (!this.get("date")) this.date = new Date();
  },

  // View Callbacks ----------------------------------------------------------

  viewWillAppear: function()
  {
    this.redraw();
    var dimensions = this.get("element").down("table").getDimensions();
    this.get("element").setStyle({
      height: dimensions.height + "px",
      width: dimensions.width + "px"
    });
  },

  // -------------------------------------------------------------------------

  redraw: function()
  {
    var date       = new Date(this.get("date"));
    var today      = new Date();
    var thisYear   = today.getFullYear();
    var thisMonth  = today.getMonth();
    var thisDay    = today.getDate();
    var month      = date.getMonth();
    var dayOfMonth = date.getDate();

    // Calculate the first day to display (including the previous month)
    date.setDate(1)
    date.setDate(-(date.getDay()) + 1)
  
    // Fill in the days of the month
    this.get("element").select("tbody tr").each(function(row, i)
    {
      var rowHasDays = false
      row.immediateDescendants().each(function(cell, j)
      {
        var day            = date.getDate()
        var dayOfWeek      = date.getDay()
        var isCurrentMonth = (date.getMonth() == month)

        // Reset classes on the cell
        cell.className = ''
        cell.date = new Date(date)
        cell.update(day)

        // Account for days of the month other than the current month
        if (!isCurrentMonth)
          cell.addClassName("otherDay");
        else
          rowHasDays = true;

        // Ensure the current day is selected
        if (isCurrentMonth && day == dayOfMonth) {
          cell.addClassName('selected')
          this.currentDateElement = cell
        }

        // Today
        if (date.getFullYear() == thisYear && date.getMonth() == thisMonth && day == thisDay)
          cell.addClassName('today')

        // Weekend
        if ([0, 6].indexOf(dayOfWeek) != -1)
          cell.addClassName('weekend')

        // Set the date to tommorrow
        date.setDate(day + 1)
      }, this);
      // Hide the extra row if it contains only days from another month
      !rowHasDays ? row.hide() : row.show()
    }, this);

    this.get("element").down("td.title").update(this.get("date").strftime("%B %Y"));
  },

  // Element -----------------------------------------------------------------

  getElement: function()
  {
    if (!this.element)
    {
      this.element = new Element("section", { className: "CalendarView" });

      // Table Element
      var tableElement = new Element("table");

      // Table Header Element
      var tableHeaderElement = new Element("thead");
      tableElement.appendChild(tableHeaderElement);

      // Title Placeholder
      var titleRowElement  = new Element("tr");
      var titleCellElement = new Element("td", { colSpan: 7, className: "title" });
      titleRowElement.appendChild(titleCellElement);
      tableHeaderElement.appendChild(titleRowElement);

      // Navigation Elements
      var navigationRowElement = new Element("tr", { className: "navigation" });
      navigationRowElement.appendChild(new Element("th").update("&#x00ab;").setData("action", "showPreviousYear"));
      navigationRowElement.appendChild(new Element("th").update("&#x2039;").setData("action", "showPreviousMonth"));
      navigationRowElement.appendChild(new Element("th", { colSpan: 3 }).update("Today").setData("action", "showToday"));
      navigationRowElement.appendChild(new Element("th").update("&#x203a;").setData("action", "showNextMonth"));
      navigationRowElement.appendChild(new Element("th").update("&#x00bb;").setData("action", "showNextYear"));
      tableHeaderElement.appendChild(navigationRowElement);

      // Weekday Header Elements
      var weekdayHeaderRow = new Element("tr", { className: "weekdays" });
      for (var i = 0; i < 7; ++i)
      {
        var weekdayCellElement = new Element("th").update(Date.shortDayNames[i].substring(0, 1));
        if (i == 0 || i == 6) weekdayCellElement.addClassName("weekend");
        weekdayHeaderRow.appendChild(weekdayCellElement);
      }
      tableHeaderElement.appendChild(weekdayHeaderRow);

      // Day Elements
      var tableBodyElement = tableElement.appendChild(new Element("tbody"));
      for (i = 6; i > 0; --i)
      {
        var tableBodyRowElement = tableBodyElement.appendChild(new Element("tr"));
        for (var j = 7; j > 0; --j)
          tableBodyRowElement.appendChild(new Element("td"));
      }

      this.element.appendChild(tableElement);
    }

    return this.element;
  },

  // Accessors & Setters -----------------------------------------------------
  
  setDate: function(date)
  {
    this.date = date;
    this.redraw();
    return date;
  },
  
  // Event Handlers ----------------------------------------------------------

  handleMouseUpEvent: function(event, element)
  {
    if (element.getData("action"))
      return this[element.getData("action")]();

    // Deselect Selected Date
    this.get("element").select(".selected").invoke("removeClassName", "selected");

    // Select Current Date
    element.addClassName("selected");

    // Set Current Date
    // TODO Use element storage
    // TODO Combine this logic with setDate?
    this.set("date", element.date);

    // Switch months...
    if (element.hasClassName("otherDay"))
      this.redraw();

    this._didSelectDate();
  },

  // View Actions ------------------------------------------------------------

  showPreviousYear: function()
  {
    var newDate = this.get("date"),
        year    = newDate.getFullYear() - 1;

    newDate.setFullYear(year);

    $L.info("Showing previous year (" + newDate.strftime("%B %Y") + ")", this);

    this.set("date", newDate);
  },

  showPreviousMonth: function()
  {
    var newDate = this.get("date"),
        month   = newDate.getMonth() - 1;

    if (month < 0)
    {
      newDate.setMonth(11);
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    else
      newDate.setMonth(month);

    $L.info("Showing previous month (" + newDate.strftime("%B %Y") + ")", this);

    this.set("date", newDate);
  },

  showToday: function()
  {
    var newDate = new Date();

    $L.info("Showing today (" + newDate.strftime("%B %d%o, %Y") + ")", this);

    this.set("date", newDate);
  },

  showNextMonth: function()
  {
    var newDate = this.get("date"),
        month   = newDate.getMonth() + 1;

    if (month > 11)
    {
      newDate.setMonth(0);
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    else
      newDate.setMonth(month);

    $L.info("Showing next month (" + newDate.strftime("%B %Y") + ")", this);

    this.set("date", newDate);
  },

  showNextYear: function()
  {
    var newDate = this.get("date"),
        year    = newDate.getFullYear() + 1;

    newDate.setFullYear(year);

    $L.info("Showing next year (" + newDate.strftime("%B %Y") + ")", this);

    this.set("date", newDate);
  },

  // Callbacks ---------------------------------------------------------------
  
  /*
   * Aphid.UI.CalendarView#_didSelectDate() -> null
   *
   * Performs any internal actions after a date has been selected before
   * calling the `didSelectDate` callback and the `calendarViewDateDidChange`
   * delegate method.
   */
  _didSelectDate: function()
  {
    // Call the public callback, that may have been implemented by a subclass.
    if (this.didSelectDate)
      this.didSelectDate(this.get("date"));
    
    // Call the calendarViewDateDidChange method on the delegate, if the
    // delegate has defined it.
    if (this.delegate && this.delegate.calendarViewDateDidChange)
      this.delegate.calendarViewDateDidChange(this, this.get("date"));
  }

});
