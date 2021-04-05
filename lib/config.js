import { pkg } from './util.js';

const {
  assign
} = Object;

export default class Config {

  constructor(argv) {
    this.argv = argv;
  }

  parse() {
    let { project, lines, only, interval, ignore, help, version } = this.argv;

    if(version) {
      let { version } = pkg();
      console.log(version);
      return false;
    }

    if(help) {
      this.usage();
      return false;
    }

    project = project || null;

    lines = lines || 250;
    if(typeof lines !== 'number') {
      return this.usage();
    }

    let split = string => string.split(',').map(component => component.trim());

    only = only || null;
    if(only) {
      if(typeof only !== 'string') {
        return this.usage();
      }
      only = split(only);
    }

    interval = interval || 2000;
    if(typeof interval !== 'number') {
      return this.usage();
    }

    ignore = ignore || null;
    if(ignore) {
      ignore = split(String(ignore));
    }

    assign(this, { project, lines, only, interval, ignore });
    return true;
  }

  usage() {
    console.log();
    console.log(`Usage: ffl [--project <project_id>] [--lines <250>] [--only <function_names>] [--interval <2000>] [--ignore <string>]`);
    console.log();
    console.log('Options:');
    console.log('  --project <project_id>   Project id. If omitted, a list of projects are presented');
    console.log('  --lines 250              Number of lines to fetch');
    console.log('  --only <function_names>  Only show logs of specified, comma-seperated functions (e.g. "funcA,funcB")');
    console.log('  --ignore <strings>       Ignroe logs for specified, comma-seperated strings (e.g. "keepalive,skipped")');
    console.log('  --interval 2000          Fetch interval');
    console.log('  --version');
    return false;
  }

}
