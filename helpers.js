import { log } from 'node:console'
import chalk from 'chalk'
import fetch from 'node-fetch'
import Conf from 'conf'
import Utils from './utils.js'

const config = new Conf({ projectName: 'filepursuit-cli' });

const API_KEY_ID = 'api_key'

const Default_file_Options = {
	Download: 'D',
	Stream: 'S',
	Open: 'O'
}

export default class Helpers {

	constructor(rlInterface) {
		this.readline = rlInterface
	}

	getResetConfigConfrimation = () => {
		return new Promise((resolve) => {
			this.readline.question(`\n${chalk.greenBright.underline("You already have configured your api key.")}\n${chalk.blueBright.bold("Do you want to reset? (Y: yes, N: no):")} `, (ans) => {
				resolve(ans)
			})
		})
	}


	handleAppConfig = ({ reset } = { reset: false }) => {
		return new Promise((resolve) => {
			// try to get config from memory
			let key = config.get(API_KEY_ID)
			if (reset && key) {
				log(Helpers.prototype)
				this.getResetConfigConfrimation().then((confm) => {
					if (confm.toUpperCase() == 'Y') {
						config.delete(API_KEY_ID)
						key = null
						resolve(handleAppConfig({ reset: false }))
					} else resolve(key)
				})
			} else {
				if (!key) {
					this.readline.question(`\n${chalk.greenBright.underline("PLEASE SET YOUR API KEY")}\n${chalk.yellowBright("You can get your api key at https://rapidapi.com/azharxes/api/filepursuit")}\n\n${chalk.blueBright.bold("Enter your API Key here:")} `, (key) => {
						if (!key) resolve(handleAppConfig({ reset: false }))
						else {
							config.set('api_key', key.trim())
							resolve(key)
						}
					})
				} else {
					resolve(key)
				}
			}


		})
	}

	getSearchQuery = () => {
		return new Promise((resolve) => {
			this.readline.question(`${chalk.bgBlue("\n Type your search query: ")} `, (query) => {
				resolve(query)
			})
		})
	}

	getSearchResults = async (searchQuery, apiKey) => {
		try {
			const response = await fetch(`https://filepursuit.p.rapidapi.com?q=${searchQuery}`, {
				method: 'GET',
				headers: {
					'X-RapidAPI-Key': apiKey,
					'X-RapidAPI-Host': 'filepursuit.p.rapidapi.com'
				}
			})
			return await response.json()
		} catch (error) {
			throw error
		}
	}

	getUserSelection = (selectionSize) => {
		return new Promise((resolve) => {
			this.readline.question(`${chalk.yellowBright.bold("\nEnter your selection:")} `, (query) => {
				if (!query || (query < 0 || query > selectionSize)) {
					log(chalk.redBright("Your selection item doesn't exist, please enter correct one"))
					resolve(getUserSelection(selectionSize))
				} else {
					resolve(query)
				}
			})
		})
	}

	searchAgain = () => {
		return new Promise((resolve) => {
			this.readline.question(`${chalk.cyanBright.bold("Do you want to try with a different search (Y/N)?")} `, (answer) => {
				if (answer.toLowerCase() == "y") resolve(true)
				else this.readline.close()
			})
		})
	}

	// Function to get user confirmation for downloading, streaming or opening the file.
	selectFileOptions = (fileType) => {
		return new Promise((resolve) => {
			this.readline.question(`${chalk.yellowBright.bold("\nSelect your option (D: download, O: open it in browser, S: stream)")} :- `, (option) => {
				if (!Object.values(Default_file_Options).includes(option.toUpperCase())) {
					log(chalk.redBright("Your selected option doesn't exist, please enter correct one"))
					resolve(selectFileOptions(fileType))
				}
				else resolve(option.toUpperCase())
			})
		})
	}

	handleSelectedOption = async (optionSelected, file) => {
		switch (optionSelected) {
			case Default_file_Options.Download:
				Utils.downloadFile(file.file_link, process.cwd() + `/ ${file.file_name}`, file.file_size)
				break
			case Default_file_Options.Stream:
				const streamUrl = await Utils.streamLinkInMPV(file.file_link, file.file_type);
				break
			case Default_file_Options.Open:
				const isUrlOpen = await Utils.openLinkInBrowser(file.file_link)
				break;
			default:
				break
		}
		return
	}
}