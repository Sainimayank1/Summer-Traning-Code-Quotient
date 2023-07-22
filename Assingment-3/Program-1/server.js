const fs = require('fs');
const path = require('path');
const { setInterval } = require('timers/promises');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

async function copyFilesWithExtension(sourceDir, targetDir, extension) {
  const files = await readdir(sourceDir);

  for (const file of files) {
    const filePath = path.join(sourceDir, file);
    if (path.extname(file) === extension) {
      const targetFile = path.join(targetDir, file);
      await copyFile(filePath, targetFile);
      console.log(`Copied ${filePath} to ${targetFile}`);
    }
  }
}


const sourceDir = '\\Users\\mayan\\OneDrive\\Desktop\\Assingment-3\\Program-1';
const targetDir = '\\Users\\mayan\\OneDrive\\Desktop\\Assingment-3\\Program-1\\Copy directory';
const extension = '.txt';



  copyFilesWithExtension(sourceDir, targetDir, extension)
    .then(() => {
      console.log('File copying completed!');
    })
    .catch((err) => {
      console.error('An error occurred:', err);
    });


