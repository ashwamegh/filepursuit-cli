# FilePursuit CLI

Use `filepursuit` to interact with FilePursuit API in the command line to **Download, Open or Stream** any file.

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ashwamegh/filepursuit-cli/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-google-brightgreen.svg)](https://google.github.io/styleguide/jsguide.html)
![JavaScript Style Guide](https://img.shields.io/github/languages/top/ashwamegh/filepursuit-cli)
[![NPM](https://img.shields.io/npm/v/filepursuit-cli?style=flat)](https://www.npmjs.com/package/filepursuit-cli)
<br>
<a href="https://www.buymeacoffee.com/ashwamegh" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

## Demo

[![asciicast](https://asciinema.org/a/591173.svg)](https://asciinema.org/a/591173)

## Table of Contents

-   [Install](#install)
-   [Usage](#usage)
-   [Contribute](#contribute)
-   [License](#license)

## Install

### NPM

```bash
npm install -g filepursuit-cli
```

### Yarn

```bash
yarn global add filepursuit-cli
```

## Usage

After installing, use below steps to start using the CLI app:

1. Get your free API key from [rapidapi.com/azharxes/api/filepursuit](https://rapidapi.com/azharxes/api/filepursuit)
2. After you have your own API key use it to configure `filepursuit-cli` in terminal by executing `filepursuit config`
3. Start using the CLI app, type `filepursuit` in the terminal and execute it. Explore FilePursuit the fun way!! 🚀🚀

```shell
    Usage:
        filepursuit
        filepursuit [options]/[command]

    Displays help information.

    Options:

        -v, --version                       output the version number
        -h, --help                          output usage information

    Commands:
        - config                             set/reset FilePursuit api key
        - discover                          discover random indexed folder links and domain links

    Examples:

    $ filepursuit
    $ filepursuit config
    $ filepursuit discover
    $ filepursuit --version
    $ filepursuit -h

```

## Contribute

> Thanks for taking the time to contribute, Feel free to add features, fix or tinker things here!!

### Reporting Issues

Found a problem? Want a new feature? First of all, see if your issue or idea has [already been reported](../../issues).
If don't, just open a [new clear and descriptive issue](../../issues/new).

### Submitting pull requests

Pull requests are the greatest contributions, so be sure they are focused in scope and do avoid unrelated commits.

-   Fork it!
-   Clone your fork: `git clone https://github.com/<your-username>/filepursuit-cli`
-   Navigate to the newly cloned directory: `cd filepursuit-cli`
-   Create a new branch for the new feature: `git checkout -b my-new-feature`
-   Install the tools necessary for development: `yarn`
-   Make your changes.
-   Commit your changes: `git commit -am 'Add some feature'`
-   Push to the branch: `git push origin my-new-feature`
-   Submit a pull request with full remarks documenting your changes

## License

[MIT License](https://opensource.org/licenses/MIT) © [Shashank Shekhar](https://ashwamegh.github.io)

## Disclaimer:

This unofficial FilePursuit CLI app is not affiliated with or endorsed by FilePursuit. It is intended for personal and educational use only. Users are responsible for their actions, ensuring compliance with copyright laws. The developers assume no liability for usage or unauthorized activities. The app is provided as-is, without warranties. Use responsibly, respect intellectual property rights, and support official services. Note that unofficial apps may carry risks, so exercise caution. We do not claim ownership of FilePursuit. For inquiries or issues, contact the official FilePursuit team. Thank you for understanding and using the app responsibly.
