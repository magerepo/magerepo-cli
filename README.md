# MageRepo CLI Tool
> Cross-platform CLI tool to interact with the MageRepo API

![](https://img.shields.io/badge/License-MIT-lightgrey.svg?style=for-the-badge)
![](https://img.shields.io/badge/Version-2.0.0-lightgrey.svg?style=for-the-badge)
![](https://img.shields.io/badge/Stability-Stable-lightgrey.svg?style=for-the-badge)

<p align="center" >
	<img src="docs/images/preview.png" width="100%" />
</p>

<!-- ffmpeg -i ./movie.mov -vf "setpts=0.25*PTS" fast.mov -->
<!-- ffmpeg -i ./fast.mov -f apng -r 7 -loop 2 preview.png -->

## About

MageRepo provides a set of tools that enables anyone to download and install Magento releases and patches. These resources are accessible through a cross platform CLI tool, a RESTFUL API, and a GUI interface via our website at [www.magerepo.com](https://www.magerepo.com/). These diverse set of tools allow users of all types to access the complete Magento release archive.

Please read our [article](https://learn.jetrails.com/article/download-magento-assets-using-magerepo) on our knowledge base for installations on how to [install](https://learn.jetrails.com/article/download-magento-assets-using-magerepo#install-magerepo-cli-tool) and [use](https://learn.jetrails.com/article/download-magento-assets-using-magerepo#using-our-cli-tool) this CLI tool.

## Getting Started

Install dependencies using your favorite node package manager:

```shell
# Using NPM
$ npm install
# Using yarn
$ yarn install
```

When developing, you can run the program by executing it from its entrypoint which is [src/index.js](src/index.js).

```shell
$ node ./src/index.js
```

## Compiling Binary

This project uses [pkg](https://github.com/zeit/pkg) to package our CLI tool to a binary. This tool compiles a binary for macOS, Windows, and Linux. You can package this tool by running the below command and the output can be found in the `dist` folder.

```shell
# Using NPM
$ npm run package
# Using yarn
$ yarn package
```

## Documentation

The user guide can be found [here](https://learn.jetrails.com/article/download-magento-assets-using-magerepo).  The user guide goes through the installation process as well as explains all the features that comes with this tool. For further support, please email [development@jetrails.com](mailto://development@jetrails.com).
