const random = require("./random.js")
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  

  let minimum1;
  let maximum1;
  function mini(min)
  {
    minimum1 = min;
  }
  
  readline.question('Enter min value: ', mini);

  readline.question('Enter max value: ', max => maximum1 = max);
  readline.close();

  let min = parseInt(minimum1);
  let max = parseInt(maximum1);
  let first = random(min,max);
  console.log("First random value is: ",first);
  let second  = random(min,max);
  console.log("Second random value is: ",second)
  console.log("Addition is :",first+second);
