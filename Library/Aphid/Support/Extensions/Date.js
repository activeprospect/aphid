/**
 * mixin Aphid.Support.Extensions.Date
 *
 * Extensions to the core JavaScript Date implementation.
 *
**/
Aphid.Support.Extensions.Date = {

  /**
   * Aphid.Support.Extensions.Date#strftime(format) -> String
   *
   * - format (String): the format string
   *
   * Formats the *date* according to the directives given in the *format*
   * string.
   *
   * ## Format Components
   *
   * The format string may contain the following formatting components. Any
   * string not matching the following will simply be passed through:
   *
   *     %a  // The abbreviated weekday name (Sun, Mon, Tue, ...)
   *     %A  // The full weekday  name (Sunday, Monday, Tuesday, ...)
   *     %b  // The abbreviated month name (Jan, Feb, Mar, ...)
   *     %B  // The full month  name (January, February, March, ...)
   *     %d  // Day of the month (1..31)
   *     %dd // Padded day of the month (01..31)
   *     %H  // Hour of the day, 12-hour clock (1..12)
   *     %HH // Padded hour of the day, 12-hour clock (01..12)
   *     %I  // Hour of the day, 24-hour clock (0..23)
   *     %II // Padded hour of the day, 24-hour clock (00..23)
   *     %m  // Month of the year (1..12)
   *     %mm // Padded month of the year (01..12)
   *     %M  // Minute of the hour (0..59)
   *     %MM // Padded minute of the hour (00..59)
   *     %o  // English ordinal suffix for the day of the month (st, nd, rd or th)
   *     %p  // Meridian indicator (am or pm)
   *     %P  // Meridian indicator (AM or PM)
   *     %S  // Second of the minute (0..60)
   *     %SS // Padded second of the minute (00..60)
   *     %w  // Day of the week (Sunday is 0, 0..6)
   *     %y  // Year without a century (00..99)
   *     %Y  // Year with century (2010)
   *     %z  // Time Zone Offset (-4, -6, +10, ...)
   *
   * ## Examples
   *
   * #### "January 1, 2010"
   *
   *     date.strftime("%B %d, %Y")
   *
   * #### "Modified on Tuesday at 4:20 PM"
   *
   *     date.strftime("Modified on %A at %h:%MM %P")
   *
  **/
  strftime: function(format)
  {
    var formatted,
        ordinals   = $H({ 1: "st", 2: "nd", 3: "rd", 4: "th", 5: "th", 6: "th", 7: "th", 8: "th", 9: "th", 0: "th" }),
        syntax     = /(^|.|\r|\n)(%([A-Za-z]{1,2}))/,
        components = {
          a:  Date.dayNames[this.getDay()].substring(0, 3),
          A:  Date.dayNames[this.getDay()],
          b:  Date.monthNames[this.getMonth()].substring(0, 3),
          B:  Date.monthNames[this.getMonth()],
          d:  this.getDate(),
          dd: this.getDate().toPaddedString(2),
          H:  this.getHours() % 12 || 12,
          HH: (this.getHours() % 12 || 12).toPaddedString(2),
          I:  this.getHours(),
          II: this.getHours().toPaddedString(2),
          m:  this.getMonth() + 1,
          mm: (this.getMonth() + 1).toPaddedString(2),
          M:  this.getMinutes(),
          MM: this.getMinutes().toPaddedString(2),
          o:  "%o", // Pass Through
          p:  this.getHours() >= 12 ? 'pm' : 'am',
          P:  this.getHours() >= 12 ? 'PM' : 'AM',
          S:  this.getSeconds(),
          SS: this.getSeconds().toPaddedString(2),
          w:  this.getDay(),
          y:  this.getFullYear().toString().substring(2, 4),
          Y:  this.getFullYear(),
          z:  "%z", // Pass Through
        };
    formatted = format.interpolate(components, syntax);
    if (formatted.indexOf("%o") >= 0)
      formatted = formatted.replace("%o", this.getDate() >= 10 ? ordinals.get(this.getDate().toString().substring(1)) : ordinals.get(this.getDate()));
    if (formatted.indexOf("%z") >= 0)
      formatted = formatted.replace("%z", (this.getTimezoneOffset() / 60) > 0 ? (this.getTimezoneOffset() / 60) * -1 : "+" + (this.getTimezoneOffset() / 60));
    return formatted;
  }

}

Object.extend(Date.prototype, Aphid.Support.Extensions.Date);

Date.monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

Date.dayNames = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];
