import { error, log } from 'node:console';
import { exec as _exec } from 'node:child_process';
import fs from 'node:fs';
import { promisify } from 'node:util';
import open from 'open';
import fetch from 'node-fetch';
import chalk from 'chalk';
import commandExists from 'command-exists';

import ProgressBar from './progressBar.js';
import { videoStreamFileTypes } from './constants.js';
import Helpers from './helpers.js';

const exec = promisify(_exec);

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
            throw chalk.redBright(
                '\n⛔️ Failed to download the file, please check your internet or try to open it in browser to check link availability!!',
            );
        }
    },

    async openUrlInMpvPlayer(url) {
        const execOutput = await exec(`mpv --idle ${url}`);
        const { error = null, stdout, stderr } = execOutput;

        if (error) {
            throw `exec error: ${error}`;
        }
        return process.exit(0);
    },

    async openUrlInVlcPlayer(url) {
        const execOutput = await exec(`vlc ${url}`);
        const { error = null, stdout, stderr } = execOutput;

        if (error) {
            throw `exec error: ${error}`;
        }
        return process.exit(0);
    },

    async streamLinkInPlayer(url, file_type) {
        try {
            if (videoStreamFileTypes.includes(file_type.toUpperCase())) {
                Helpers.showRotatingLoader();
                let hasMpv = false,
                    hasVLC = false;
                try {
                    hasMpv = Boolean(await commandExists('mpv'));
                } catch (e) {} // just keeping catch block for not interrupting the process
                try {
                    hasVLC = Boolean(await commandExists('vlc'));
                } catch (e) {} // just keeping catch block for not interrupting the process
                if (hasMpv) return this.openUrlInMpvPlayer(url);
                else if (hasVLC) return this.openUrlInVlcPlayer(url);
                else
                    throw '\n👾 Either `mpv` or `vlc` was not found to stream the url!!\nmpv reference: https://mpv.io/installation/\nvlc reference: https://www.videolan.org/vlc/';
            } else throw '\n👾 The link is not streamable!!';
        } catch (error) {
            log(chalk.redBright(error));
            log(chalk.cyanBright('\n🌐 Falling back to opening the link in the browser!'));
            return this.openLinkInBrowser(url);
        }
    },

    async openLinkInBrowser(url) {
        await open(url);
        return process.exit(0);
    },
};
