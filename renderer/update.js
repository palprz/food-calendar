"use strict";

const { ipcRenderer } = require("electron");

document.getElementById("img").addEventListener("click", (evt) => {
  let element = document.getElementById("img");
  let currentHeight = element.clientHeight;
  if (currentHeight === 100) {
    element.style.height = "300px";
  } else if (currentHeight === 300) {
    element.style.height = "500px";
  } else if (currentHeight === 500) {
    element.style.height = "800px";
  } else if (currentHeight === 800) {
    element.style.height = "100px";
  }
});

document.getElementById("imageInput").addEventListener("change", (evt) => {
  let uploadedFile = evt.target.files[0];
  // is it cancelled providing a new image?
  if (uploadedFile !== undefined && uploadedFile.length !== 0) {
    document.getElementById("imageName").innerText = uploadedFile.name;
  }
});

document.getElementById("update").addEventListener("click", (evt) => {
  let id = document.getElementById("id").value;
  let uploadedFiles = document.getElementById("imageInput").files;
  let notes = document.getElementById("notes").value;
  let deleteImageFlag = document.getElementById("deleteImage").checked;
  let path;
  if (uploadedFiles !== undefined && uploadedFiles.length !== 0) {
    path = uploadedFiles[0].path;
  }

  ipcRenderer.send("update-calendar-day", id, path, notes, deleteImageFlag);
});

document.getElementById("cancel").addEventListener("click", (evt) => {
  ipcRenderer.send("cancel-update-calendar-day");
});
