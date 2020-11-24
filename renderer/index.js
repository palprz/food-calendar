"use strict";

const { ipcRenderer } = require("electron");

function clickedDay(idCalendarDay) {
  ipcRenderer.send("render-update-day-window", idCalendarDay);
}

function rerenderMonth(whichMonth, highlightedDayID) {
  ipcRenderer.send("rerender-month", whichMonth, highlightedDayID);
}
