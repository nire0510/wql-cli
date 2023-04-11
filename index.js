#! /usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import ora from 'ora';
import path from 'path';
import { exec } from 'child_process';
import * as actions from './src/actions.js';
import * as fsUtils from './src/utils/fs.js';
import log from './src/utils/logger.js';
import __dirname from './__dirname.js';

// process.on('uncaughtException', () => {
process.on('UnhandledPromiseRejectionWarning', () => {
  console.log(chalk.red('An error has occured'));
  process.exit(-1);
});

const program = new Command();
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')));
const spinner = ora('wait...');

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version)
  .addHelpText('after', () => {
    console.log();
    console.log('Examples:');
    const examples = actions.getExamples();

    examples.forEach((example) => {
      console.log(chalk.bold(`? ${example.description}:`));
      console.log(chalk.green(`> ${example.code}`));
      console.log();
    });
  });

program
  // .command('run')
  .description('Run a web query')
  .argument('<query>', 'web query (wrapped with apostrophes)')
  .option('-nh, --no-headless', 'Non-headless mode')
  .option('-ns, --no-spinner', 'No spinner mode')
  .option('-o, --open', 'Open results also in default JSON viewer', false)
  .option('-sc, --screenshot', 'Take a screenshot', false)
  .option('-tm, --turbo-mode', 'Turbo mode (skip downloading images, fonts and stylesheets)', false)
  .option('-ud, --user-data-dir <path>', 'User data directory path')
  .option('-ep, --executable-path <path>', 'Chrome executable path')
  .option('-vh, --viewport-height <height>', 'Viewport height', 1080)
  .option('-vw, --viewport-width <width>', 'Viewport width', 1920)
  .option('-w, --wait <selector>', 'Wait before query execution ({selector}/load/domcontentloaded/networkidle0/networkidle2)')
  .action(async (query, options) => {
    options.spinner && spinner.start();
    try {
      const output = await actions.runQuery(query, {
        headless: options.headless,
        turbo: options.turboMode,
        screenshot: options.screenshot,
        userDataDir: options.userDataDir,
        executablePath: options.executablePath,
        viewport: {
          height: options.viewportHeight,
          width: options.viewportWidth,
        },
        wait: options.wait,
      });

      options.spinner && spinner.succeed('Web query completed');
      console.log(JSON.stringify(output, null, 2));
      if (options.open) {
        const start = process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open';
        const filepath = await fsUtils.generateTempFilePath('json');
        const url = 'file://' + filepath;

        await fsUtils.writeFile(filepath, JSON.stringify(output, null, 2));
        exec(start + ' ' + url);
      }
    } catch (error) {
      const logFile = await log(error.stack);

      options.spinner && spinner.fail(`Web query failed to complete (log file: ${logFile})`);
      process.exit(-1);
    }
  });

program.parse();
