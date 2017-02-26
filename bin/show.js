#!/usr/bin/env node
'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _diff = require('diff');

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _environmentOverride = require('../dist/environment-override');

var _environmentOverride2 = _interopRequireDefault(_environmentOverride);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var showDiff = function showDiff(diffManifest) {
  console.info();
  console.info('Diff');

  diffManifest.forEach(function (part) {
    var prefix = '';
    var color = 'grey';

    if (part.added) {
      prefix = '++';
      color = 'green';
    } else if (part.removed) {
      prefix = '--';
      color = 'red';
    }

    process.stdout.write(_colors2.default[color]('' + prefix + part.value));
  });

  console.info();
};

/**
 * @fileOverview
 *   Command line based helper to see what values you can override using this
 *   module from a json file.
 */

var showErrorAndExit = function showErrorAndExit(error) {
  console.error(_colors2.default.red('Error: ' + error));
  console.error();
};

console.info('Environment Override Show v' + _package2.default.version + '.');

if (process.argv[2] === 'help' || process.argv[2] === '--help' || process.argv.length > 5 || process.argv.length < 3) {
  console.info(_package2.default.description);
  console.info('This script will output the environment variable names you can use to override the values in the provided json file.');
  console.info('Script expects upto 3 arguments,');
  console.info('\t- argument 1: relative path to json file to check [required].');
  console.info('\t- argument 2: a prefix for the environment variable [optional].');
  console.info('\t- argument 3: output mode (all/diff/original/current) [optional].');
  console.info('e.g.');
  console.info('\tnode show.js test.json foo diff');

  process.exit();
}

var file = process.argv[2];
var prefix = process.argv[3] ? process.argv[3] : '';
var output = process.argv[4];

if (!_fs2.default.existsSync(file)) {
  showErrorAndExit('Expecting 1st argument to be a path to a json file.');
}

console.info('Loading file: ' + file);

var fileContents = _fs2.default.readFileSync(file);
var json = void 0;

try {
  json = JSON.parse(fileContents);
} catch (e) {
  showErrorAndExit('File is not in JSON format.');
}

console.info();
console.info('Using the prefix "' + prefix.toUpperCase() + '" you have the following overrides:');
console.info();

var overridenManifest = (0, _environmentOverride2.default)(json, prefix, true);

if (output) {
  console.info();
  console.info('Ouput requested: ' + output);

  var originalStringify = JSON.stringify(json, null, '  ');
  var overridenStringify = JSON.stringify(overridenManifest, null, '  ');
  var diffManifest = (0, _diff.diffLines)(originalStringify, overridenStringify);

  switch (output) {
    case 'all':
      console.info();
      console.info('Original');
      console.info();
      console.info(originalStringify);

      console.info();
      console.info('Overridden');
      console.info();
      console.info(overridenStringify);

      showDiff(diffManifest);
      break;
    case 'diff':
      showDiff(diffManifest);
      break;
    case 'original':
      console.info();
      console.info('Original');
      console.info();
      console.info(originalStringify);
      break;
    case 'current':
      console.info();
      console.info('Overridden');
      console.info();
      console.info(overridenStringify);
      break;
    default:
      break;
  }
}

console.info();
console.info('Done');

process.exit();
