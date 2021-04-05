import Config from './config.js';
import Projects from './projects.js';
import Entries from './entries.js';

export default class Application {

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
