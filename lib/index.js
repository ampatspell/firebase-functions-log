let minimist = require('minimist');
let argv = minimist(process.argv.slice(2));

let Application = require('./app');
let app = new Application(argv);

app.start().then(() => {}, err => {
  console.error(err);
  console.error(err.stack);
  process.exit(-1);
});
