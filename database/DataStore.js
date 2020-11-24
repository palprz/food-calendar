"use strict";

const Store = require("electron-store");

module.exports = class DataStore extends (
  Store
) {
  constructor() {
    super({ name: "CalendarDates" });

    // for now do not read from the local storage...
    this.days = this.get("days") || [];
    // this.days = [];

    // parse Date object
    let recreatedDays = [];
    for (var i = 0; i < this.days.length; i++) {
      let day = this.days[i];
      day.date = new Date(day.date);
      recreatedDays[i] = day;
    }

    this.days = recreatedDays;
  }

  /**
   * Save key in the local storage.
   *
   * This function should be called after each modification (add/remove)
   * to be sure that the collection of objects will be still the same
   * after restart the application.
   */
  save() {
    this.set("days", this.days);
    return this;
  }

  /**
   * Get a single CalendarDay filered by ID.
   * @param {*} id e.g. '21-11-2020'
   */
  getByID(id) {
    return this.days.filter((element) => element.id === id)[0];
  }

  /**
   * Get array with CalendarDays filtered by month + yearand sorted.
   * @param {*} date
   */
  getByMonthAndYear(date) {
    let found = this.days.filter(
      (element) =>
        element.date.getMonth() === date.getMonth() &&
        element.date.getYear() === date.getYear()
    );

    //sorting by 'date' field
    return found.sort((a, b) => a.date - b.date);
  }

  /**
   * Add a single CalendarDay to the store
   * @param {*} day
   */
  add(day) {
    this.days = [...this.days, day];
    return this.save();
  }

  /**
   * Add an array of CalendarDays to the store
   * @param {*} days
   */
  addAll(days) {
    this.days = this.days.concat(days);
    return this.save();
  }

  /**
   * Delete and add provided CalendarDay.
   * @param {*} day
   */
  update(day) {
    this.days = this.days.filter((element) => element.id !== day.id);
    this.days = [...this.days, day];
    return this.save();
  }
};
