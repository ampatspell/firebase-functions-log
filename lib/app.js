let Config = require('./config');
let Projects = require('./projects');

class Application {

  constructor(argv) {
    this.config = new Config(argv);
    this.projects = new Projects();
  }

  async start() {
    if(!this.config.parse()) {
      return false;
    }
    if(!this.config.project) {
      this.config.projectId = await this.projects.choose();
    }
  }

}

module.exports = Application;
