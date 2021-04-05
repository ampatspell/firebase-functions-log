import { exec } from 'child_process';

const maxBuffer = 1024 * 1024 * 128;

export const run = cmd => new Promise((resolve, reject) => {
  exec(cmd, { maxBuffer }, (error, stdout, stderr) => {
    if(error) {
      return reject(error);
    }
    resolve({ stdout, stderr });
  });
});

export const firebase = cmd => run(`firebase ${cmd}`);
