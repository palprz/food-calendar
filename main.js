"use strict";

const { app, ipcMain } = require("electron");
const ejse = require("ejs-electron");

const NewWindow = require("./type/Window");
const CalendarDay = require("./type/CalendarDay");
const DataStore = require("./database/DataStore");
const FileUtil = require("./database/FileUtil");
const CalendarUtil = require("./util/CalendarUtil");

const calendarStore = new DataStore();

const MAIN_WINDOW_PATH = "file://" + __dirname + "/renderer/index.ejs";
const UPDATE_WINDOW_PATH = "file://" + __dirname + "/renderer/update.ejs";

require("electron-reload")(__dirname);

/**
 * Main function of the application.
 * Initialize the main window and store with CalendarDays.
 */
function main() {
  let mainWindow = new NewWindow({});

  let days = CalendarUtil.fillRestMonthDays(
    calendarStore.getByMonthAndYear(new Date()),
    new Date()
  );
  renderMainView(days, CalendarUtil.getTodayID());

  let updateCalendarWin;

  /**
   * Handle request for rendering new window for updating calendar day.
   */
  ipcMain.on("render-update-day-window", (event, idCalendarDay) => {
    // is it open already?
    if (!updateCalendarWin) {
      updateCalendarWin = new NewWindow({
        width: 800,
        height: 800,
        // close with the main window
        parent: mainWindow,
      });

      renderUpdateView(idCalendarDay);

      // cleanup
      updateCalendarWin.on("closed", () => {
        updateCalendarWin = null;
      });
    }
  });

  /**
   * Handle request for updating calendar day in store.
   */
  ipcMain.on(
    "update-calendar-day",
    (event, id, imagePath, newNotes, deleteImageFlag) => {
      let day = calendarStore.getByID(id);
      if (day === undefined) {
        day = createDummyDay(id);
      }

      if (deleteImageFlag) {
        FileUtil.deleteFile(id);
        day.hasImage = false;
      } else {
        if (imagePath !== undefined) {
          FileUtil.uploadFile(id, imagePath);
          day.hasImage = true;
        }
      }
      day.notes = newNotes;
      calendarStore.update(day);

      let savedDays = calendarStore.getByMonthAndYear(day.date);
      let updatedDays = CalendarUtil.fillRestMonthDays(savedDays, day.date);

      renderMainView(updatedDays, day.id);

      // close window and clean it
      updateCalendarWin.close();
      updateCalendarWin = null;
    }
  );

  /**
   * Handle request for cancelling update of calendar day.
   */
  ipcMain.on("cancel-update-calendar-day", (event) => {
    // close window and clean it
    updateCalendarWin.close();
    updateCalendarWin = null;
  });

  /**
   * Handle request for rendering month (previous, next, today month).
   */
  ipcMain.on("rerender-month", (event, whichMonth, highlightedDayID) => {
    let renderDays, dateToFillMonth, savedDays;

    let day = calendarStore.getByID(highlightedDayID);
    if (day === undefined) {
      day = createDummyDay(highlightedDayID);
    }

    switch (whichMonth) {
      case "previous":
        dateToFillMonth = CalendarUtil.getPreviousMonth(day.date);
        savedDays = calendarStore.getByMonthAndYear(dateToFillMonth);
        renderDays = CalendarUtil.fillRestMonthDays(savedDays, dateToFillMonth);
        break;
      case "next":
        dateToFillMonth = CalendarUtil.getNextMonth(day.date);
        savedDays = calendarStore.getByMonthAndYear(dateToFillMonth);
        renderDays = CalendarUtil.fillRestMonthDays(savedDays, dateToFillMonth);
        break;
      case "current":
      default:
        savedDays = calendarStore.getByMonthAndYear(new Date());
        renderDays = CalendarUtil.fillRestMonthDays(savedDays, new Date());
        break;
    }

    let hightlightDay = renderDays[day.date.getDate() - 1].id;
    renderMainView(renderDays, hightlightDay);
  });

  /**
   * Create "dummy" CalendarDay which isn't saved in store, but still can be use to display data/be modified.
   * @param {*} idCalendarDay e.g. '21-22-2020'
   */
  function createDummyDay(idCalendarDay) {
    let splitted = idCalendarDay.split("-");
    let day = splitted[0];
    let month = splitted[1];
    let year = splitted[2];

    return new CalendarDay([day, month, year].join("-"), "");
  }

  /**
   * Provide data and render new window for updating calendar day.
   * @param {*} idCalendarDay
   */
  function renderUpdateView(idCalendarDay) {
    let day = calendarStore.getByID(idCalendarDay);

    if (day === undefined) {
      day = createDummyDay(idCalendarDay);
    }

    // Missing one of the data = 'Not allowed to load local resource' as an error
    ejse.data({
      id: day.id,
      updatingDay: CalendarUtil.getDisplayDate(day.date),
      notes: day.notes,
      userDataPath: app.getPath("userData"),
    });
    // Missing one of the tag = 'Not allowed to load local resource' as an error
    updateCalendarWin.loadURL(UPDATE_WINDOW_PATH);
  }

  /**
   * Provide data and render/re-render main window.
   * @param {*} calendarDays Array with calendar days to be displayed in window.
   * @param {*} hightlightDayID
   */
  function renderMainView(calendarDays, hightlightDayID) {
    let previousMonthDays = CalendarUtil.getNumberPreviousMonthEmptyDays(
      calendarDays
    );
    let nextMonthDays = CalendarUtil.getNumberNextMonthEmptyDays(calendarDays);

    // Missing one of the data = 'Not allowed to load local resource' as an error
    ejse.data({
      displayMonth: CalendarUtil.getMonthList()[
        calendarDays[0].date.getMonth()
      ],
      displayYear: calendarDays[0].date.getFullYear(),
      previousMonthDays: previousMonthDays,
      nextMonthDays: nextMonthDays,
      calendarDays: calendarDays,
      daysOfWeek: CalendarUtil.getWeekDays(),
      highlightedDayID: hightlightDayID,
      userDataPath: app.getPath("userData"),
    });
    // Missing one of the tag = 'Not allowed to load local resource' as an error
    mainWindow.loadURL(MAIN_WINDOW_PATH);
  }
}

app.on("ready", main);

app.on("window-all-closed", function () {
  app.quit();
});
