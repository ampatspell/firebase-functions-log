# ffl

`firebase functions:log` wrapper which periodically fetches new log entries.

``` bash
$ npm install firebase-functions-log -g
```

```
$ ffl --help

Usage: ffl [--project <project_id>] [--lines <250>] [--only <function_names>] [--interval <2000>] [--ignore <string>]

Options:
  --project <project_id>   Project id. If omitted, a list of projects are presented
  --lines 250              Number of lines to fetch.
  --only <function_names>  Only show logs of specified, comma-seperated functions (e.g. "funcA,funcB")
  --ignore <strings>       Ignroe logs for specified, comma-seperated strings (e.g. "keepalive,skipped")
  --interval 2000          Fetch interval
  --version
```

![screenshot](https://raw.githubusercontent.com/ampatspell/firebase-functions-log/master/screenshot.png)
