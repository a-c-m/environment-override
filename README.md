Environment Override
====================

[![view on npm](http://img.shields.io/npm/v/environment-override.svg?style=flat)](https://www.npmjs.org/package/environment-override)
[![npm module downloads per month](http://img.shields.io/npm/dm/environment-override.svg?style=flat)](https://www.npmjs.org/package/environment-override)
[![Dependency status](https://david-dm.org/a-c-m/environment-override.svg?style=flat)](https://david-dm.org/a-c-m/environment-override)
[![Travis status](https://img.shields.io/travis/a-c-m/environment-override.svg)](https://travis-ci.org/a-c-m/environment-override)
[![Code coverage](https://img.shields.io/codecov/c/github/a-c-m/environment-override.svg)](https://codecov.io/gh/a-c-m/environment-override)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> Takes an object holding configuration and checks the environment variables for overrides to its values. Great for hapi manifests and other types of configuration.


# How to use

The code is currently synchronous as its expected to only be run once as part of the startup of the app.

## In code

    var override = require('environment-override').override;
    var manifest = require('./manifest.json');
    override(manifest, 'PREFIX_');

## Command line

`environment-override` ships with an utility that can show you all the variables from a json file that can be overridden via environment variables:

    node ./node_modules/environment-override/bin/show test.json

To avoid polluting the environment you can set a prefix for the variables:

    node ./node_modules/environment-override/bin/show test.json -p PREFIX_

It can also show the original and overridden versions:

    node ./node_modules/environment-override/bin/show test.json -o diff

The output can be:

* `diff` - Shows the diff between the two versions.
* `all` - Shows both the original and the overridden versions.
* `original` - Shows the original version.
* `current` - Shows the overridden version.

## Removing values

To remove a value set the entry to `OVERRIDE_REMOVE_DATA` in the environment.

## Whole structures

To override whole structures use a stringified JSON object in the variable:

	exports PREFIX_VARIABLE='{"key1": "value1", "key2": "value2"}'


# Example

Assuming we have the following `test.json` file:

	{
	  "field1": "value1",
	  "field2": {
	    "s1": "v1",
	    "s2": "v2"
	  },
	  "field3": "value3"
	}

We can see all the variables by running `show.js`:

	./bin/show.js test.json -p APP_                              
	INFO: Using the prefix "APP_" you have the following overrides:
			APP_FIELD1
	    APP_FIELD2
	    APP_FIELD2_S1
	    APP_FIELD2_S2
	    APP_FIELD3

We can override them by setting various values:

	export APP_FIELD1 = 'updated1'
	export APP_FIELD2 = '{"s1": "updated_f2_value1", "s2": "updated_f2_value2"}';
	export APP_FIELD3 = 'OVERRIDE_REMOVE_DATA'

Running `show.js` again will inform us of which variables were overridden:

	./bin/show.js test.json -p APP_                                      
	INFO: Using the prefix "APP_" you have the following overrides:
	  overridden APP_FIELD1
	  overridden APP_FIELD2
	     removed APP_FIELD3	     
 
 We can also get a diff: 

	./bin/show.js test.json -p APP_ -o diff                                      
