"use strict";

module.exports = class CalendarDay {
  /**
   * Create a new CalendarDay object.
   *
   * Example of field values:
   * - id => "12-06-2020"
   * - displayDate => "24" for 24th day of the month
   * - dayOfWeek => "0" for Sunday
   * - date => "new Date()" object
   * - notes => "I love Sundays"
   * @param {*} id Based on this, CalendarDay will generate the rest fields
   * @param {*} notes
   */
  constructor(id, notes) {
    let splitted = id.split("-");
    this.id = id;
    this.notes = notes;
    this.displayDate = splitted[0];
    this.date = new Date(splitted[2], splitted[1] - 1, splitted[0]);
    this.dayOfWeek = this.getDayOfWeek(
      new Date(splitted[2], parseInt(splitted[1] - 1), splitted[0]).getDay()
    );
    this.hasImage = false;
  }

  /**
   * Get the day of the week - it will return number instead of name of the day.
   *
   * Note: the week start from Sunday and it's counting as '0' day of the week
   * Sun -> 0
   * Mon -> 1
   * Tue -> 2
   * [...]
   * Sat -> 6
   * @param {*} date
   */
  getDayOfWeek(day) {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day];
  }
};
