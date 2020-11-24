"use strict";

const CalendarDay = require("../type/CalendarDay");

module.exports = class CalendarUtil {
  /**
   * Get array with days of the week (short names - 3 letters).
   */
  static getWeekDays() {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  }

  /**
   * Get array with months (full names).
   */
  static getMonthList() {
    return [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  }

  /**
   * Get full date as a String e.g. '10 October 2020'.
   */
  static getDisplayDate(date) {
    return [
      date.getDate(),
      this.getMonthList()[date.getMonth()],
      date.getFullYear(),
    ].join(" ");
  }

  /**
   * Get ID of current day as a String e.g. '21-10-2020'
   */
  static getTodayID() {
    return [
      new Date().getDate(),
      new Date().getMonth() + 1,
      new Date().getFullYear(),
    ].join("-");
  }

  /**
   * Get the number of 'empty days' to display empty cells with days for the previous month.
   * @param {*} calendarDays To identify the first day of the month and check the week day
   */
  static getNumberPreviousMonthEmptyDays(calendarDays) {
    let dayOfWeekNumber = calendarDays[0].date.getDay();
    // is it Sunday?
    if (dayOfWeekNumber === 0) {
      return 6;
    } else {
      return dayOfWeekNumber - 1;
    }
  }

  /**
   * Get the number of 'empty days' to display empty cells with days for the next month.
   * @param {*} calendarDays To identify the last day of the month and check the week day
   */
  static getNumberNextMonthEmptyDays(calendarDays) {
    let dayOfWeekNumber = calendarDays[calendarDays.length -1].date.getDay();
    // is it Sunday?
    if (dayOfWeekNumber === 0) {
      return 0;
    } else {
      return 7 - dayOfWeekNumber;
    }
  }

  /**
   * Check which date has got no saved CalendarDay and needs to be fill by dummy CalendarDay.
   * @param {*} savedDays
   * @param {*} dayOfMonthToFill One of the day in the specific month and year
   */
  static fillRestMonthDays(savedDays, dayOfMonthToFill) {
    let dummyDays = [];
    let month = dayOfMonthToFill.getMonth();
    let year = dayOfMonthToFill.getFullYear();
    // it's returning the last day of previous month
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    for (var day = 1; day <= daysInMonth; day++) {
      let id = [day, month + 1, year].join("-");
      if (this.isDummyDayNeeded(savedDays, id)) {
        dummyDays.push(new CalendarDay(id, ""));
      }
    }

    let filledArray = savedDays.concat(dummyDays);
    return filledArray.sort((a, b) => a.date - b.date);
  }

  /**
   * Check if needs to create CalendarDay for provided ID.
   * @param {*} savedDays
   * @param {*} idToCheck
   */
  static isDummyDayNeeded(savedDays, idToCheck) {
    for (var i = 0; i < savedDays.length; i++) {
      if (savedDays[i].id === idToCheck) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get 'Date' object based on provided 'Date' object with previous month.
   * @param {*} date
   */
  static getPreviousMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
  }

  /**
   * Get 'Date' object based on provided 'Date' object with next month.
   * @param {*} date
   */
  static getNextMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }
};
