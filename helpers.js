import { log } from 'node:console';
import chalk from 'chalk';
import fetch from 'node-fetch';
import Conf from 'conf';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const appPackage = require('./package.json');
import Utils from './utils.js';
import { API_KEY_ID, LinkOptions, cliOptions } from './constants.js';

const config = new Conf({ projectName: 'filepursuit-cli' });

export default class Helpers {
    constructor(rlInterface) {
        this.readline = rlInterface;
    }

    handleOptionsTriggers = async ({ main, option }) => {
        const argvsOptions = [
            {
                caller: this.handleAppConfig,
                arguments: {
                    reset: true,
                },
                options: cliOptions.config,
            },
            {
                caller: main,
                arguments: {
                    discover: true,
                    triggeredFromOptions: true,
                },
                options: cliOptions.discover,
            },
            {
                caller: this.getAppVersion,
                arguments: {
                    discover: true,
                    triggeredFromOptions: true,
                },
                options: cliOptions.version,
            },
            {
                caller: this.showHelpMenu,
                arguments: {
                    discover: true,
                    triggeredFromOptions: true,
                },
                options: cliOptions.help,
            },
        ];

        const argvOption = argvsOptions.find((a) => a.options.includes(option));
        if (argvOption) {
            return await argvOption.caller(argvOption.arguments);
        }

        return;
    };

    getAppVersion = () => {
        log(chalk.yellowBright.bold(appPackage.version));
        this.readline.close();
    };

    showHelpMenu = () => {
        log(`
    Usage:
        filepursuit
        filepursuit [opitons]/[command]

    Displays help information.

    Options:

        -v, --version                       output the version number
        -h, --help                          output usage information

    Commands:
        - config                             set/reset FilePursuit api key
        - discover                           discover every file crawled by FilePursuit using links and domains 
    
    Examples:

    $ filepursuit
    $ filepursuit config
    $ filepursuit discover
    $ filepursuit --version
    $ filepursuit -h
    `);

        this.readline.close();
    };

    getResetConfigConfrimation = () => {
        return new Promise((resolve) => {
            this.readline.question(
                `\n${chalk.yellowBright.bold('You already have configured your api key.')}\n${chalk.blueBright.bold(
                    '🤔 Do you want to reset? (Y: yes, N: no):',
                )} `,
                (ans) => {
                    resolve(ans);
                },
            );
        });
    };

    handleAppConfig = ({ reset } = { reset: false }) => {
        return new Promise((resolve) => {
            // try to get config from memory
            let key = config.get(API_KEY_ID);
            if (reset && key) {
                this.getResetConfigConfrimation().then((confm) => {
                    if (confm.toUpperCase() == 'Y') {
                        config.delete(API_KEY_ID);
                        key = null;
                        resolve(this.handleAppConfig({ reset: false }));
                    } else {
                        resolve(key);
                        this.readline.close();
                    }
                });
            } else {
                if (!key) {
                    this.readline.question(
                        `\n${chalk.blueBright.underline('PLEASE SET YOUR API KEY')}\n${chalk.yellowBright(
                            '🔗 You can get your api key at https://rapidapi.com/azharxes/api/filepursuit',
                        )}\n\n${chalk.blueBright.bold('⎆ Enter your API Key here:')} `,
                        (key) => {
                            if (!key) resolve(this.handleAppConfig({ reset: false }));
                            else {
                                config.set('api_key', key.trim());
                                log(
                                    `\n${chalk.greenBright.bold('🚀 You have successfully configured your API key!!')}`,
                                );
                                resolve(key);
                                this.readline.close();
                            }
                        },
                    );
                } else {
                    resolve(key);
                    this.readline.close();
                }
            }
        });
    };

    validateAppConfig = () => {
        let key = config.get(API_KEY_ID);
        if (!key) {
            log(chalk.redBright("\n😬 You haven't configured your API key"));
            log(chalk.blueBright('\nPlease configure your API key using `filepursuit config`\n'));
            this.readline.close();
        } else return key;
    };

    getSearchQuery = () => {
        return new Promise((resolve) => {
            this.readline.question(`${chalk.bgBlue('\n 🕵️‍♀️ Type your search query: ')} `, (query) => {
                if (query) resolve(query);
                else {
                    log(
                        `${chalk.redBright.bold("\n😑 Search keyword can't be empty.")}\n${chalk.cyanBright.bold(
                            '💡 Use `filepursuit discover` for results without keyword',
                        )}`,
                    );
                    resolve(this.getSearchQuery());
                }
            });
        });
    };

    getFilePursuitLinks = async ({ searchQuery, apiKey, discover }) => {
        let url = `https://filepursuit.p.rapidapi.com?q=${searchQuery}`;
        if (discover) url = 'https://filepursuit.p.rapidapi.com/discover';

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': apiKey,
                    'X-RapidAPI-Host': 'filepursuit.p.rapidapi.com',
                },
            });
            const { status, result, files_found } = await response.json();
            let discoverResults = null;
            if (discover)
                discoverResults = result.map((r) => ({
                    file_name: r.folder_name || r.domain_name,
                    file_link: r.folder_link || r.domain_link,
                    file_size: null,
                }));
            return {
                status,
                links_found: files_found || discoverResults,
            };
        } catch (error) {
            throw error;
        }
    };

    getUserSelection = (selectionSize) => {
        return new Promise((resolve) => {
            this.readline.question(`${chalk.yellowBright.bold('\n🪧 Enter your selection:')} `, (query) => {
                if (!query || query < 0 || query > selectionSize) {
                    log(chalk.redBright("😬 Your selection item doesn't exist, please enter correct one"));
                    resolve(getUserSelection(selectionSize));
                } else {
                    resolve(query);
                }
            });
        });
    };

    searchAgain = () => {
        return new Promise((resolve) => {
            this.readline.question(
                `${chalk.cyanBright.bold('🤔 Do you want to try with a different search (Y/N)?')} `,
                (answer) => {
                    if (answer.toLowerCase() == 'y') resolve(true);
                    else this.readline.close();
                },
            );
        });
    };

    // Function to get user confirmation for downloading, streaming or opening the file.
    selectFileOptions = (fileType) => {
        return new Promise((resolve) => {
            this.readline.question(
                `${chalk.yellowBright.bold(
                    '\n👻 Select your option (D: download, O: open it in browser, S: stream)',
                )} :- `,
                (option) => {
                    if (!Object.values(LinkOptions).includes(option.toUpperCase())) {
                        log(chalk.redBright("😬 Your selected option doesn't exist, please enter correct one"));
                        resolve(selectFileOptions(fileType));
                    } else resolve(option.toUpperCase());
                },
            );
        });
    };

    handleSelectedOption = async (optionSelected, file) => {
        switch (optionSelected) {
            case LinkOptions.Download:
                Utils.downloadFile(file.file_link, process.cwd() + `/ ${file.file_name}`, file.file_size);
                break;
            case LinkOptions.Stream:
                const streamUrl = await Utils.streamLinkInPlayer(file.file_link, file.file_type);
                break;
            case LinkOptions.Open:
                const isUrlOpen = await Utils.openLinkInBrowser(file.file_link);
                break;
            default:
                break;
        }
    };
}
