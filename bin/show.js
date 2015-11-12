#!/usr/bin/env node

/**
 * @fileOverview
 *   Command line based helper to see what values you can override using this
 *   module from a json file.
 */


/* ADD MODULES */

var override = require('../');

var fs = require('fs');
var util = require('util');

var jsdiff = require('diff');
require('colors');


console.info();

/* BASIC COMMAND LINE TOOL VALIDAITON / HELP */

if (process.argv[2] == 'help' || process.argv[2] == '--help' ||
    process.argv.lenght > 4 || process.argv.lenght < 3) {
  console.info('This script will output the environment variable names you can use to override the values in the provided json file.');
  console.info('Script expects upto 3 arguments,');
  console.info(' argument 1: relative path to  json file to check [required]');
  console.info(' argument 2: a prefix for the environment variable [optional]');
  console.info(' argument 3: output mode (all/diff/original/current) [optional]');
  console.info('e.g.');
  console.info('\tnode show.js test.json foo diff');
  process.exit();
}

var file = process.argv[2];
var prefix = (process.argv[3] ? process.argv[3] : '');
var output = process.argv[4];

if (!fs.existsSync(file)) {
  console.info('Expecting 1st argument to be a path to a json file');
  process.exit();
}


/* SETUP / GET VALUES */

console.info('Loading file : ' + process.cwd() + '/' + file);

var json = require(process.cwd() + '/' + file);

// hack to deep clone without needing another dependency.
var original = JSON.parse(JSON.stringify(json));

console.info("\n"+ 'Using the prefix "'+ prefix.toUpperCase() +'" you have the following overrides:'+"\n");


/* DO IT */

override(json, prefix, true);


/* GIVE ADDIITONAL OUTPUT IF REQUESTED */

if (output) {
  console.info("\nOuput requested : " + output);

  var originalStringify = JSON.stringify(original, null, '  ');
  var jsonStringify = JSON.stringify(json, null, '  ');
  var diff = jsdiff.diffLines(originalStringify, jsonStringify);

  var _showDiff = function _showDiff(diff) {
    console.info("\nDiff");
    diff.forEach(function diffEach(part){
      // green for additions, red for deletions
      // grey for common parts
      var color = part.added ? 'green' :
                  part.removed ? 'red' : 'grey';

      process.stdout.write(part.value[color]);
    });
  };

  switch (output) {
    case 'all':
      console.info("\nOriginal\n", originalStringify);
      console.info("\nOverridden\n", jsonStringify);
      _showDiff(diff);
      break;
    case 'diff':
      _showDiff(diff);
      break;
    case 'original':
      console.info("\nOriginal\n", originalStringify);
      break;
    case 'current':
      console.info("\nOverridden\n", jsonStringify);
      break;
  }
}


console.info("\n\n" +'Done');

process.exit();
