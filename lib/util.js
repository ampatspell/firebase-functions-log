import { exec } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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

export const pkg = () => {
  let __dirname = dirname(fileURLToPath(import.meta.url));
  return JSON.parse(fs.readFileSync(join(__dirname, '../package.json'), 'utf-8'))
}
