import { log } from 'node:console';
import { exec } from 'node:child_process';
import fs from 'node:fs';
import open from 'open';
import fetch from 'node-fetch';
import chalk from 'chalk';

import ProgressBar from './progressBar.js';

export default {
	async downloadFile(url, path, fileSize) {
		try {
			const response = await fetch(url);
			if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
			const fileStream = fs.createWriteStream(path);

			const totalFileSize = response.headers.get('content-length');
			const Bar = new ProgressBar();
			Bar.init(totalFileSize);
			let downloadedSize = 0;
			await new Promise((resolve, reject) => {
				response.body.pipe(fileStream);
				response.body.on('response', function (response) {
					log(response.headers['content-length']);
				});
				response.body.on('data', (chunk) => {
					// chunk = buffer
					downloadedSize += chunk.length;
					Bar.update(downloadedSize);
				});
				response.body.on('error', reject);
				response.body.on('end', () => log(`\n${chalk.blueBright('Downloaded!')}`));
				fileStream.on('finish', resolve);
			});
		} catch (error) {
			throw error;
		}
	},

	async streamLinkInPlayer(url, file_type) {
		try {
			// const { error, stdout, stderr } = await exec(`mpv --idle ${url}`)
			(function () {
				var P = ['\\', '|', '/', '-'];
				var x = 0;
				return setInterval(function () {
					process.stdout.write('\r' + P[x++]);
					x &= 3;
				}, 250);
			})();
			exec(`mpv --idle ${url}`, (error, stdout, stderr) => {
				if (error) {
					error(`exec error: ${error}`);
					return;
				}
				log(`stdout: ${stdout}`);
				error(`stderr: ${stderr}`);
			});
			// if (error) {
			// 	log(error)
			// 	// try fallback options
			// }
		} catch (error) {
			error(error);
		}
	},

	async openLinkInBrowser(url) {
		await open(url);
		return true;
	},
};
