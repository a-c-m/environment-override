#!/usr/bin/env node
'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cli = require('cli');

var _cli2 = _interopRequireDefault(_cli);

var _diff = require('diff');

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _environmentOverride = require('../dist/environment-override');

var _environmentOverride2 = _interopRequireDefault(_environmentOverride);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileOverview
 *   Command line based helper to see what values you can override using this
 *   module from a json file.
 */

var showDiff = function showDiff(diffManifest) {
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
};

var clone = function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
};

_cli2.default.enable('version', 'status');
_cli2.default.setApp(_path2.default.join(__dirname, '/../package.json'));

_cli2.default.parse({
  prefix: ['p', 'A prefix for the environment variable', 'string', ''],
  output: ['o', 'The output mode: all/diff/original/current', 'string', '']
});

_cli2.default.main(function (args, options) {
  if (!args.length) {
    _cli2.default.getUsage();
  }

  var file = args[0];
  if (!_fs2.default.existsSync(file)) {
    _cli2.default.error(file + ' is not a path to a json file.');
    process.exit();
  }

  var fileContents = _fs2.default.readFileSync(file);
  var manifest = void 0;

  try {
    manifest = JSON.parse(fileContents);
  } catch (e) {
    _cli2.default.error(file + ' is not in json format.');
    process.exit();
  }

  if (options.prefix) {
    _cli2.default.info('Using the prefix "' + options.prefix.toUpperCase() + '" you have the following overrides:');
  } else {
    _cli2.default.info('You have the following overrides:');
  }

  var originalManifest = clone(manifest);
  (0, _environmentOverride2.default)(manifest, options.prefix, true);

  if (options.output) {
    var output = options.output.toLowerCase();
    _cli2.default.info('Ouput requested: ' + output);

    var originalStringify = JSON.stringify(originalManifest, null, '  ');
    var overridenStringify = JSON.stringify(manifest, null, '  ');
    var diffManifest = (0, _diff.diffLines)(originalStringify, overridenStringify);

    switch (output) {
      case 'all':
        _cli2.default.info('Original');
        _cli2.default.info(originalStringify);

        _cli2.default.info('Overridden');
        _cli2.default.info(overridenStringify);

        showDiff(diffManifest);
        break;
      case 'diff':
        _cli2.default.info('Diff');
        showDiff(diffManifest);
        break;
      case 'original':
        _cli2.default.info('Original');
        _cli2.default.info(originalStringify);
        break;
      case 'current':
        _cli2.default.info('Overridden');
        _cli2.default.info(overridenStringify);
        break;
      default:
        break;
    }
  }
});
