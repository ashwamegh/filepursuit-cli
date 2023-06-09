#! /usr/bin/env node

import { log } from 'node:console'
import { argv } from 'node:process'
import { stdin as input, stdout as output } from 'node:process'
import * as readline from 'node:readline'
import chalk from 'chalk'
import Helpers from '../helpers.js'

const rl = readline.createInterface({ input, output })
const helpers = new Helpers(rl)

const argvsMethods = {
	'config': {
		caller: helpers.handleAppConfig,
		arguments: {
			reset: true
		}
	}
}

const main = async () => {
	try {

		if (argv.length > 2) {
			const lastArgv = argv.pop().trim()
			if (Object.keys(argvsMethods).includes(lastArgv)) {
				const argvRef = argvsMethods[lastArgv]
				await argvRef.caller(argvRef.arguments)
			}
		}

		const apiKey = await helpers.handleAppConfig()
		const searchQuery = await helpers.getSearchQuery()
		const { files_found = [] } = await helpers.getSearchResults(searchQuery, apiKey)
		if (files_found.length > 0)
			files_found.forEach((r, i) => log(`\n${chalk.yellow.underline.bold(i + 1)}.${chalk.green.bold(r.file_name)} ${r.file_size ? '- ' + chalk.magentaBright(r.file_size) : ''} - ${chalk.italic.blueBright(r.file_link)} `))
		else {
			log(chalk.yellowBright(`\nWe were not able to find the files with "${searchQuery}" as search query`))
			const retrySearch = await helpers.searchAgain()
			if (retrySearch) await main()
		}

		const selectedLink = await helpers.getUserSelection(files_found.length)
		const file = files_found[Number(selectedLink) - 1]
		log(chalk.greenBright(`\n${chalk.cyanBright.bold.italic.underline("Your selection:")} \n${chalk.green.bold(file.file_name)} ${file.file_size ? '- ' + chalk.magentaBright(file.file_size) : ''} - ${chalk.italic.blueBright(file.file_link)} `))

		const optionSelected = await helpers.selectFileOptions(file.file_type)
		await helpers.handleSelectedOption(optionSelected, file)
		rl.close()
	} catch (error) {
		log(error)
		rl.close()
	}
}

main()

export default {}