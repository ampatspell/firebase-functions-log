let Config = require('./config');
let Projects = require('./projects');
let { firebase } = require('./util');

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
    await this.fetch();
  }

  async fetch() {
    let { projectId, lines, only } = this.config;
    let args = [
      'functions:log',
      `--project ${projectId}`,
      `--lines ${lines}`,
      only && `---only ${only}`,
      '--json'
    ].filter(Boolean).join(' ')

    let { stdout } = await firebase(args);
    let json = JSON.parse(stdout);

    json.result.forEach(line => {
      console.log(`${line.timestamp} ${line.resource.labels.function_name} ${line.severity} ${line.textPayload}`);
    });
  }

}

module.exports = Application;
