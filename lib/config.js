let {
  assign
} = Object;

class Config {

  constructor(argv) {
    this.argv = argv;
  }

  parse() {
    let { project, lines, only, interval, help } = this.argv;

    if(help) {
      this.usage();
      return true;
    }

    project = project || null;

    lines = lines || 250;
    if(typeof lines !== 'number') {
      return this.usage();
    }

    only = only || null;
    if(only) {
      if(typeof only !== 'string') {
        return this.usage();
      }
      only = only.split(',').map(string => string.trim());
    }

    interval = interval || 2000;
    if(typeof interval !== 'number') {
      return this.usage();
    }

    assign(this, { project, lines, only, interval });
    return true;
  }

  usage() {
    console.log();
    console.log(`Usage: ffl [--project <project_id>] [--lines <250>] [--only <function_names>] [--interval <2000>]`);
    console.log();
    console.log('Options:');
    console.log('  --project <project_id>   Project ID');
    console.log('  --lines 250              Number of lines to fetch');
    console.log('  --only <function_names>  Only show logs of specified, comma-seperated functions (e.g. "funcA,funcB")');
    console.log('  --interval 2000          ');
    return false;
  }

}

module.exports = Config;
