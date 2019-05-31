[![Version](https://img.shields.io/github/package-json/v/anwarhahjjeffersongeorge/constamp/master.svg)](https://github.com/anwarhahjjeffersongeorge/constamp)[![Build Status](https://travis-ci.com/anwarhahjjeffersongeorge/constamp.svg?branch=master)](https://travis-ci.com/anwarhahjjeffersongeorge/constamp) [![codecov](https://codecov.io/gh/anwarhahjjeffersongeorge/constamp/branch/master/graph/badge.svg)](https://codecov.io/gh/anwarhahjjeffersongeorge/constamp)
------------

[![license](https://img.shields.io/github/license/anwarhahjjeffersongeorge/constamp.svg)](UNLICENSE) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-blue.svg)](https://standardjs.com)

--------------

# &mdash; `constamp` &mdash;
### [Documentation](https://anwarhahjjeffersongeorge.github.io/constamp/)

### Context stamping.

Instead of just _time_ stamping a process or event, _context_ stamp it to reveal the:

- __T__: Epoch time and high-resolution process time,
- __W__: Who is doing all of this JavaScript, including the user and computing architecture,
- __D__: Directories where all of this JavaScript is being done.

------
## Installation

Run `npm install constamp`


## Usage
This module exports a class `Constamp`. The class creates an immutable object.

#### Stamping

    import { Constamp } from 'constamp'
    const c = Constamp()

#### Partially cloning a stamp:

    const cCopy = Constamp({
      json: c.toJson()
    })

#### Using a dayjs format string:

    const cFormat = Constamp({
      format: 'DD/MM/YYYY'
    })

## Command-line

    constamp -h

    Usage
      $ constamp <command> [options]

    Available Commands
      show    Display local context stamp (raw) info.
      save    Save the local context stamp (hash) to a file.
      load    Load a saved context stamp file for comparison

    For more info, run any command with the `--help` flag
      $ constamp show --help
      $ constamp save --help

    Options
      -v, --version    Displays current version
      -h, --help       Displays this message

## Testing

npm test
