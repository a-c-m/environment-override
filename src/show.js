#!/usr/bin/env node

/**
 * @fileOverview
 *   Command line based helper to see what values you can override using this
 *   module from a json file.
 */

import fs from 'fs';
import path from 'path';
import cli from 'cli';
import { diffLines } from 'diff';
import colors from 'colors';
import override from '../dist/environment-override';

const showDiff = (diffManifest) => {
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
};

const clone = obj => JSON.parse(JSON.stringify(obj));

cli.enable('version', 'status');
cli.setApp(path.join(__dirname, '/../package.json'));

cli.parse({
  prefix: ['p', 'A prefix for the environment variable', 'string', ''],
  output: ['o', 'The output mode: all/diff/original/current', 'string', ''],
});

cli.main((args, options) => {
  if (!args.length) {
    cli.getUsage();
  }

  const file = args[0];
  if (!fs.existsSync(file)) {
    cli.error(`${file} is not a path to a json file.`);
    process.exit();
  }

  const fileContents = fs.readFileSync(file);
  let manifest;

  try {
    manifest = JSON.parse(fileContents);
  } catch (e) {
    cli.error(`${file} is not in json format.`);
    process.exit();
  }

  if (options.prefix) {
    cli.info(`Using the prefix "${options.prefix.toUpperCase()}" you have the following overrides:`);
  } else {
    cli.info('You have the following overrides:');
  }

  const originalManifest = clone(manifest);
  override(manifest, options.prefix, true);

  if (options.output) {
    const output = options.output.toLowerCase();
    cli.info(`Ouput requested: ${output}`);

    const originalStringify = JSON.stringify(originalManifest, null, '  ');
    const overridenStringify = JSON.stringify(manifest, null, '  ');
    const diffManifest = diffLines(originalStringify, overridenStringify);

    switch (output) {
      case 'all':
        cli.info('Original');
        cli.info(originalStringify);

        cli.info('Overridden');
        cli.info(overridenStringify);

        showDiff(diffManifest);
        break;
      case 'diff':
        cli.info('Diff');
        showDiff(diffManifest);
        break;
      case 'original':
        cli.info('Original');
        cli.info(originalStringify);
        break;
      case 'current':
        cli.info('Overridden');
        cli.info(overridenStringify);
        break;
      default:
        break;
    }
  }
});
