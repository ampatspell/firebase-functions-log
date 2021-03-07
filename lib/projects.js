const { firebase } = require('./util');
const inquirer = require('inquirer');

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

  async prompt() {
    let { all: choices } = this;
    let { project } = await inquirer.prompt([
      {
        type: 'list',
        loop: true,
        name: 'project',
        message: `Choose a projectId`,
        choices
      }
    ]);
    return choices.find(({ name }) => name === project);
  }

  async choose() {
    await this.load();
    let { id } = await this.prompt();
    return id;
  }

}

module.exports = Projects;
