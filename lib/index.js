import minimist from 'minimist';
import Application from './app.js';

const argv = minimist(process.argv.slice(2));
const app = new Application(argv);

app.start().then(() => {}, err => {
  console.error(err);
  console.error(err.stack);
  process.exit(-1);
});
