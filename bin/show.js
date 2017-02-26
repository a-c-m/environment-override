#!/usr/bin/env node
'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _diff = require('diff');

var _diff2 = _interopRequireDefault(_diff);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _environmentOverride = require('../dist/environment-override');

var _environmentOverride2 = _interopRequireDefault(_environmentOverride);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import util from 'util';
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

    process.stdout.write(prefix + part.value[color]);
  });

  console.info();
};

/**
 * @fileOverview
 *   Command line based helper to see what values you can override using this
 *   module from a json file.
 */

var showError = function showError(error) {
  console.error(_colors2.default.red('Error: ' + error));
  console.error();
};

console.info('Environment Override Show v' + _package2.default.version + '.');

if (process.argv[2] === 'help' || process.argv[2] === '--help' || process.argv.length > 5 || process.argv.length < 3) {
  console.info(_package2.default.description);
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
var prefix = process.argv[3] ? process.argv[3] : '';
var output = process.argv[4];

if (!_fs2.default.existsSync(file)) {
  showError('Expecting 1st argument to be a path to a json file.');
  process.exit();
}

console.info('Loading file: ' + file);

var fileContents = _fs2.default.readFileSync(file);
var json = void 0;

try {
  json = JSON.parse(fileContents);
} catch (e) {
  showError('File is not in JSON format.');
  process.exit();
}

console.info('\nUsing the prefix "' + prefix.toUpperCase() + '" you have the following overrides:\n');

var overridenManifest = (0, _environmentOverride2.default)(json, prefix, true);

if (output) {
  console.info('\nOuput requested: ' + output);

  var originalStringify = JSON.stringify(json, null, '  ');
  var overridenStringify = JSON.stringify(overridenManifest, null, '  ');
  var diffManifest = _diff2.default.diffLines(originalStringify, overridenStringify);

  switch (output) {
    case 'all':
      console.info('\nOriginal\n', originalStringify);
      console.info('\nOverridden\n', overridenStringify);
      showDiff(diffManifest);
      break;
    case 'diff':
      showDiff(diffManifest);
      break;
    case 'original':
      console.info('\nOriginal\n', originalStringify);
      break;
    case 'current':
      console.info('\nOverridden\n', overridenStringify);
      break;
    default:
      break;
  }
}

console.info("\n\n" + 'Done');

process.exit();
