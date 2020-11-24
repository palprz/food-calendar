"use strict";

const { app } = require("electron");
const path = require("path");
const fs = require("fs");

module.exports = class FileUtil {
  /**
   * Read under provided path and save file under 'userData' folder.
   * The file will be saved with '.png' extension.
   * @param {*} id
   * @param {*} imagePath
   */
  static uploadFile(id, imagePath) {
    fs.readFile(imagePath, function read(err, content) {
      if (err) {
        console.log("Error during loading file: " + err);
        throw err;
      }

      let newFilePath = path.join(app.getPath("userData"), "/" + id + ".png");
      fs.writeFile(newFilePath, content, function (err) {
        if (err) {
          console.log("Error during saving file: " + err);
          throw err;
        }
      });
    });
  }

  /**
   * Delete file from 'userData' folder.
   * @param {*} id
   */
  static deleteFile(id) {
    let filePath = path.join(app.getPath("userData"), "/" + id + ".png");
    fs.unlink(filePath, function read(err) {
      if (err) {
        // ENOENT => file doesn't exist
        if ("ENOENT" !== err.code) {
          console.log("Error during deleting file: " + err);
          throw err;
        }
      }
    });
  }
};
