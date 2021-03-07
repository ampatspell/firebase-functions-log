const { exec } = require('child_process')

const maxBuffer = 1024 * 1024 * 128;

const run = cmd => new Promise((resolve, reject) => {
  exec(cmd, { maxBuffer }, (error, stdout, stderr) => {
    if(error) {
      return reject(error);
    }
    resolve({ stdout, stderr });
  });
});

const firebase = cmd => run(`firebase ${cmd}`);

module.exports = {
  run,
  firebase
};
