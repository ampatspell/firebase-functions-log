let Config = require('./config');
let Projects = require('./projects');
let Entries = require('./entries');

class Application {

  constructor(argv) {
    this.config = new Config(argv);
    this.projects = new Projects();
    this.entries = new Entries(this);
  }

  async start() {
    if(!this.config.parse()) {
      return false;
    }
    if(!this.config.project) {
      this.config.project = await this.projects.choose();
    }
    console.log(`Project: ${this.config.project}`);
    await this.entries.start();
  }

}

module.exports = Application;
