const https = require('https');
const fs = require('fs');

const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
const outputFile = 'output.txt';
let data = "";

https.get(apiUrl, response => {
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
        data += chunk;
    });


    response.on('end', () => {
        fs.writeFile(outputFile, data, (err) => {
            if (!err)
                console.log("Succesfully fetched data")
        })
    })


}).on('error', err => {
    console.error('Error retrieving data:', err);
});
