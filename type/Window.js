"use strict";

const { BrowserWindow } = require("electron");

const defaultProps = {
  width: 1000,
  height: 500,
  show: false,

  webPreferences: {
    nodeIntegration: true,
  },
};

class Window extends BrowserWindow {
  constructor({ ...windowSettings }) {
    super({ ...defaultProps, ...windowSettings });

    // this.webContents.openDevTools();
    this.once("ready-to-show", () => {
      this.show();
    });
  }
}

module.exports = Window;
