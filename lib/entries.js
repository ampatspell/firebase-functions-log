let ora = require('ora');
let chalk = require('chalk');
let { firebase } = require('./util');

let dt = date => new Intl.DateTimeFormat('en-us', { dateStyle: 'short', timeStyle: 'short' }).format(date);

class Entries {

  constructor(app) {
    this.app = app;
    this.spinner = ora();
  }

  get config() {
    return this.app.config;
  }

  async fetch() {
    let { project, lines, only } = this.config;

    let args = [
      'functions:log',
      `--project ${project}`,
      `--lines ${lines}`,
      only && `---only ${only}`,
      '--json'
    ].filter(Boolean).join(' ');

    let json;

    this.spinner.start(`${project}: fetching…`);
    try {
      let { stdout } = await firebase(args);
      json = JSON.parse(stdout);
    } finally {
      this.spinner.stop();
    }

    return json;
  }

  selectAfter(result, insertId) {
    let missing = false;
    if(insertId) {
      let existing = result.find(object => object.insertId === insertId);
      if(existing) {
        let idx = result.indexOf(existing);
        result = result.slice(idx + 1);
      } else {
        missing = true;
      }
    }
    if(result.length > 0) {
      insertId = result[result.length - 1].insertId;
    }
    return {
      result,
      missing,
      insertId
    };
  }

  async fetchNext(insertId) {
    let json = await this.fetch();
    let current = this.selectAfter(json.result.reverse(), insertId);
    insertId = current.insertId;

    current.result.forEach(row => {
      let { timestamp, resource: { labels: { function_name } }, severity, textPayload } = row;
      timestamp = dt(new Date(timestamp));
      severity = severity ? severity[0] : '?';

      let items = [
        chalk.gray(timestamp),
        chalk.red(severity),
        function_name && chalk.green(function_name),
        textPayload
      ].filter(Boolean);

      console.log(...items);
    });

    setTimeout(() => this.fetchNext(insertId), this.config.interval);
  }

  start() {
    this.fetchNext();
    return new Promise(() => {});
  }

}

module.exports = Entries;
