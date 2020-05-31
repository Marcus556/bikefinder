const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.question('heesfsf', function (test) {
  console.log(test)
})



rl.on("close", function () {
  console.log("\nBYE BYE !!!");
  process.exit(0);
});

