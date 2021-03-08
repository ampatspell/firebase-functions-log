const { firebase } = require('./util');
const inquirer = require('inquirer');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

class Projects {

  constructor() {
  }

  async load() {
    let { stdout } = await firebase('projects:list --json');
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
    return all.filter(({ id, displayName }) => id.startsWith(value) || displayName.startsWith(value));
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

module.exports = Projects;
