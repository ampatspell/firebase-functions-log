const { exec } = require('child_process')

const run = cmd => new Promise((resolve, reject) => {
  exec(cmd, (error, stdout, stderr) => {
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
