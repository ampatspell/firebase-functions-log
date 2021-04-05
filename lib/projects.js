import { firebase } from './util.js';
import inquirer from 'inquirer';
import autocomplete from 'inquirer-autocomplete-prompt';
import ora from 'ora';

inquirer.registerPrompt('autocomplete', autocomplete);

export default class Projects {

  constructor() {
    this.spinner = ora();
  }

  async load() {
    this.spinner.start(`Loading projects…`);

    let resp;
    try {
      resp = await firebase('projects:list --json');
    } finally {
      this.spinner.stop();
    }

    let { stdout } = resp;
    let json = JSON.parse(stdout);
    let projects = json.result
      .filter(({ state }) => state === 'ACTIVE')
      .map(({ projectId: id, displayName }) => ({ id, displayName, name: `${id} – ${displayName}` }));

      this.all = projects;
  }

  filter(value) {
    let { all } = this;
    if(!value) {
      return all;
    }
    let match = string => string && string.toLowerCase().includes(value.toLowerCase());
    return all.filter(({ id, displayName }) => match(id) || match(displayName));
  }

  async prompt() {
    let { project } = await inquirer.prompt([
      {
        type: 'autocomplete',
        name: 'project',
        message: 'Project:',
        source: (_, input) => this.filter(input)
      }
    ]);
    return this.all.find(({ name }) => name === project);
  }

  async choose() {
    await this.load();
    let { id } = await this.prompt();
    return id;
  }

}
