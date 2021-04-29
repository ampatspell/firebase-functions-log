import ora from 'ora';
import chalk from 'chalk';
import { firebase } from './util.js';
import { inspect } from 'util';

const dt = date => new Intl.DateTimeFormat('en-us', { dateStyle: 'short', timeStyle: 'short' }).format(date);

export default class Entries {

  constructor(app) {
    this.app = app;
    this.spinner = ora();
  }

  get config() {
    return this.app.config;
  }

  async fetch(retry) {
    let { project, lines, only } = this.config;

    let args = [
      'functions:log',
      `--project ${project}`,
      `--lines ${lines}`,
      only && `---only ${only}`,
      '--json'
    ].filter(Boolean).join(' ');

    let json;

    let status = 'fetching';
    if(retry) {
      status = 'retrying';
    }
    this.spinner.start(`${project}: ${status}…`);
    try {
      let { stdout } = await firebase(args);
      json = JSON.parse(stdout);
    } catch(err) {
      // TODO
      return;
    } finally {
      this.spinner.stop();
    }

    json.result = json.result || [];

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
        insertId = null;
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

  isIgnored(string) {
    let { ignore } = this.config;
    if(!ignore || !string) {
      return false;
    }
    return !!ignore.find(ignored => string.includes(ignored));
  }

  async fetchNext(insertId, retry) {
    let json = await this.fetch(retry);
    if(json) {
      retry = false;

      let current = this.selectAfter(json.result.reverse(), insertId);
      insertId = current.insertId;

      if(current.missing) {
        console.log();
        console.log('-- missing entries --');
        console.log();
      }

      current.result.forEach(row => {
        let { timestamp, resource: { labels: { function_name } }, severity, textPayload, jsonPayload } = row;
        timestamp = dt(new Date(timestamp));
        severity = severity ? severity[0] : '?';

        if(this.isIgnored(textPayload)) {
          return;
        }

        if(!textPayload && jsonPayload) {
          let message = jsonPayload.message;
          delete jsonPayload.message;
          textPayload = `${message}\n${inspect(jsonPayload, { colors: true, depth: null })}`;
        }

        let items = [
          chalk.gray(timestamp),
          chalk.red(severity),
          function_name && chalk.green(function_name),
          textPayload
        ].filter(Boolean);

        console.log(...items);
      });
    } else {
      retry = true;
    }
    setTimeout(() => this.fetchNext(insertId, retry), this.config.interval);
  }

  start() {
    this.fetchNext();
    return new Promise(() => {});
  }

}
