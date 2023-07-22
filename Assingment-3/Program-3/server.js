const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter file name: ', (fileName) => {
    rl.question('Enter the text you want to write to the file: ', (inputText) => {
        const filePath = '\\Users\\mayan\\OneDrive\\Desktop\\Assingment-3\\Program-3\\'+fileName;

        fs.writeFile(filePath, inputText, (err) => {
            if (err) {
                console.error('An error occurred while writing to the file:', err);
            } else {
                console.log('Successfully wrote to the file!');
            }

            rl.close();
        });
    });
})
