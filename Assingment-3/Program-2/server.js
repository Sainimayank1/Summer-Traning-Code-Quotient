const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);

async function PrintFilesWithExtension(sourceDir, extension) {
  const files = await readdir(sourceDir);

  for (const file of files) {
    const filePath = path.join(sourceDir, file);
    if (path.extname(file) === extension) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              console.error('An error occurred:', err);
              return;
            }
          
            console.log('File contents:');
            console.log(data);

        });
    }
  }
}


const sourceDir = '\\Users\\mayan\\OneDrive\\Desktop\\Assingment-3\\Program-2';
const extension = '.txt';



PrintFilesWithExtension(sourceDir, extension)




