#! /usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import { exec } from 'child_process';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import ora from 'ora';
import { fileURLToPath } from 'url';
import * as actions from './actions.js';
import * as fsUtils from './utils/fs.js';
import log from './utils/logger.js';

// process.on('uncaughtException', () => {
process.on('UnhandledPromiseRejectionWarning', () => {
  console.log(chalk.red('An error has occured'));
  process.exit(-1);
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json')));
const program = new Command();
const spinner = ora('wait...');

program
  .name('wql')
  .description(pkg.description)
  .version(pkg.version)
  .addHelpText('after', function () {
    const examples = actions.getExamples();

    console.log();
    console.log(chalk.underline('Examples:'));
    console.log();
    examples.forEach((example) => {
      console.log(chalk.bold(`? ${example.description}:`));
      console.log(chalk.green(`> ${example.code}`));
      console.log();
    });

    console.log('ℹ For more information about the query syntax, pleas visit: https://www.npmjs.com/package/@nire0510/wql#syntax');
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
  .option('-vh, --viewport-height <height>', 'Viewport height', 720)
  .option('-vw, --viewport-width <width>', 'Viewport width', 1080)
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
