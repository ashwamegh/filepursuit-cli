#! /usr/bin/env node

import { log } from 'node:console';
import { argv, stdin as input, stdout as output } from 'node:process';
import * as readline from 'node:readline';
import chalk from 'chalk';
import Helpers from '../helpers.js';
import { LinkOptions, cliOptions } from '../constants.js';

const rl = readline.createInterface({ input, output });
const helpers = new Helpers(rl);

const main = async ({ discover, triggeredFromOptions } = { discover: false, triggeredFromOptions: false }) => {
    try {
        // Setting up the options and triggers for the options from CLI
        if (!triggeredFromOptions) {
            const appliedOption = argv.pop().trim();
            let allValidOptions = [];
            Object.values(cliOptions).forEach((o) => (allValidOptions = allValidOptions.concat(o)));
            if (allValidOptions.includes(appliedOption))
                return await helpers.handleOptionsTriggers({ main, option: appliedOption });
        }

        const apiKey = await helpers.validateAppConfig();
        if (!apiKey) return;

        // Begin code for search or discover
        let searchQuery = '';

        if (!discover) {
            searchQuery = await helpers.getSearchQuery();
        }

        const { links_found } = await helpers.getFilePursuitLinks({ searchQuery, apiKey, discover });
        // End code for search or discover

        // Begin: If there are no results found, let user search again
        if (links_found && links_found.length > 0) {
            links_found.forEach((r, i) => {
                log(
                    `\n${chalk.yellow.underline.bold(i + 1)}) ${chalk.green.bold(r.file_name)} ${
                        r.file_size ? '- ' + chalk.magentaBright(r.file_size) : ''
                    } - ${chalk.italic.blueBright(r.file_link)} `,
                );
            });
        } else {
            log(chalk.magentaBright(`\nWe were not able to find the files with "${searchQuery}" as search query`));

            const retrySearch = await helpers.searchAgain();
            if (retrySearch) await main();
        }

        // End: If there are no results found, let user search again

        // Begin User selection for what to do with the link
        const selectedLink = await helpers.getUserSelection(links_found.length);
        const file = links_found[Number(selectedLink) - 1];

        log(
            chalk.greenBright(
                `\n${chalk.cyanBright.bold.italic.underline('Your selection:')} \n${chalk.green.bold(file.file_name)} ${
                    file.file_size ? '- ' + chalk.magentaBright(file.file_size) : ''
                } - ${chalk.italic.blueBright(file.file_link)} `,
            ),
        );

        if (discover) {
            await helpers.handleSelectedOption(LinkOptions.Open, file);
        } else {
            const optionSelected = await helpers.selectFileOptions(file.file_type);
            await helpers.handleSelectedOption(optionSelected, file);
        }
        // End User selection for what to do with the link

        rl.close();
    } catch (error) {
        log(error);
        rl.close();
    }
};

main();

export default {};
