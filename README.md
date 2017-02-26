Environment Override
====================

[![view on npm](http://img.shields.io/npm/v/environment-override.svg?style=flat)](https://www.npmjs.org/package/environment-override)
[![npm module downloads per month](http://img.shields.io/npm/dm/environment-override.svg?style=flat)](https://www.npmjs.org/package/environment-override)
[![Dependency status](https://david-dm.org/a-c-m/environment-override.svg?style=flat)](https://david-dm.org/a-c-m/environment-override)
[![Travis status](https://img.shields.io/travis/BrandedEntertainmentNetwork/environment-override.svg)](https://travis-ci.org/BrandedEntertainmentNetwork/environment-override)
[![Code coverage](https://img.shields.io/codecov/c/github/BrandedEntertainmentNetwork/environment-override.svg)](https://codecov.io/gh/BrandedEntertainmentNetwork/environment-override)
[![License](https://img.shields.io/github/license/BrandedEntertainmentNetwork/environment-override.svg)](https://opensource.org/licenses/MIT)

> Takes a object and checks the environment variables for overrides to its values. Great for manifests and other configuration.


How to use
----------

The code is currently synchronous as its expected to only be run once as part
of the startup of the app.

In code :

    var override = require('environment-override');
    var json = require('./some.json');
    override(json, 'PREFIX_');


Or you can run it from the command line to see the variables you need to set :

    node ./node_modules/environment-override/bin/show test.json

Use the following to see other options :

    node ./node_modules/environment-override/bin/show --help

To override, simply set the environment variables you want to override, you can
remove by setting the entry to be equal `OVERRIDE_REMOVE_DATA`.

To override whole structures use stringified JSON objects in variables. ie:

``
exports PREFIX_VARIABLE='{"key1": "value1", "key2": "value2"}'
``


Code coverage
--------------
        >
        > npm test
        >
        > environment-override@0.1.3 test /.../environment-override
        > istanbul cover _mocha --dir ../coverage/environment -- --no-timeouts -R dot test/tests/



          ․․․․․․․․․․

          10 passing (14ms)

        =============================================================================
        Writing coverage object [./coverage/coverage.json]
        Writing coverage reports at [./coverage]
        =============================================================================

        =============================== Coverage summary ===============================
        Statements   : 100% ( 21/21 )
        Branches     : 100% ( 12/12 )
        Functions    : 100% ( 1/1 )
        Lines        : 100% ( 21/21 )
        ================================================================================
