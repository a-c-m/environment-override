#!/usr/bin/env node

/**
 * @fileOverview
 *   Command line based helper to see what values you can override using this
 *   module from a json file.
 */

import fs from 'fs';
import { diffLines } from 'diff';
import colors from 'colors';
import override from '../dist/environment-override';
import metadata from '../package.json';

const showDiff = (diffManifest) => {
  console.info();
  console.info('Diff');

  diffManifest.forEach((part) => {
    let prefix = '';
    let color = 'grey';

    if (part.added) {
      prefix = '++';
      color = 'green';
    } else if (part.removed) {
      prefix = '--';
      color = 'red';
    }

    process.stdout.write(colors[color](`${prefix}${part.value}`));
  });

  console.info();
};

const showErrorAndExit = (error) => {
  console.error(colors.red(`Error: ${error}`));
  console.error();
};


console.info(`Environment Override Show v${metadata.version}.`);

if (process.argv[2] === 'help' || process.argv[2] === '--help' || process.argv.length > 5 || process.argv.length < 3) {
  console.info(metadata.description);
  console.info('This script will output the environment variable names you can use to override the values in the provided json file.');
  console.info('Script expects upto 3 arguments,');
  console.info('\t- argument 1: relative path to json file to check [required].');
  console.info('\t- argument 2: a prefix for the environment variable [optional].');
  console.info('\t- argument 3: output mode (all/diff/original/current) [optional].');
  console.info('e.g.');
  console.info('\tnode show.js test.json foo diff');

  process.exit();
}

const file = process.argv[2];
const prefix = (process.argv[3] ? process.argv[3] : '');
const output = process.argv[4];

if (!fs.existsSync(file)) {
  showErrorAndExit('Expecting 1st argument to be a path to a json file.');
}

console.info(`Loading file: ${file}`);

const fileContents = fs.readFileSync(file);
let json;

try {
  json = JSON.parse(fileContents);
} catch (e) {
  showErrorAndExit('File is not in JSON format.');
}

console.info();
console.info(`Using the prefix "${prefix.toUpperCase()}" you have the following overrides:`);
console.info();

const overridenManifest = override(json, prefix, true);

if (output) {
  console.info();
  console.info(`Ouput requested: ${output}`);

  const originalStringify = JSON.stringify(json, null, '  ');
  const overridenStringify = JSON.stringify(overridenManifest, null, '  ');
  const diffManifest = diffLines(originalStringify, overridenStringify);

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
