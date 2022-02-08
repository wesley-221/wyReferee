[![Windows Build][windows-build-badge]][windows-build]
[![Linux Build][linux-build-badge]][linux-build]
[![MacOS Build][macos-build-badge]][macos-build]

# Introduction
wyReferee is an irc client made for osu!. Create a tournament, add participants, webhooks and even mappools, all with quality of life features for every single thing.
wyReferee also has an auto-updater, meaning when a new update is available, this will be automatically downloaded and installed to ensure you have the latest version.

# Getting started
There are several ways on how to use the client. The easiest way is to simply download the `.exe` file (currently only support Windows builds out of the box, Mac and Linux have to be built manually, see below).

## Downloading the latest version
To download the latest version of wyReferee, click on [this](https://github.com/wesley-221/wyReferee/releases/latest) and download `wyReferee-Setup-x.x.x.exe`. As mentioned above, only Windows builds are supported for now.

## Building the client yourself
Building the client yourself does not provide an auto-update like with the pre-built `.exe` straight from Github. When a new update comes out, you will have to build wyReferee again.

To build the client, you need the following software:
- git
- Node v12 (v12 is guaranteed to work)

Once you have git and Node installed, run the following steps in a terminal.

Clone the repository (this will put the files of wyReferee in the current working directory):
```bash
git clone git@github.com:wesley-221/wyReferee.git
```

Install dependencies:
```bash
npm install
```

Install Electron dependencies:

```bash
cd app/
npm install
```

Updating to the latest version of wyReferee (run this from the wyReferee directory):
```bash
git fetch
git pull
```
Once you have pulled the new changes, you have to install the dependencies again just to be safe.

Building wyReferee:
- If you are on a Windows machine, run `npm run electron:windows` (this builds the same `.exe` as in the latest release)
- If you are on a Mac, run `npm run electron:mac`
- If you are on a Linux distro, run `npm run electron:linux`

## Building for development
If you want to develop the client, you can follow all the steps show above (Building the client yourself), except for the `Building wyReferee` part.
Instead of that, you have to run the client like so:
```bash
npm start
```

This will launch wyReferee in a hot-reloaded Electron window, where any change you make will reload the client with the new changes.

[linux-build-badge]: https://github.com/wesley-221/wyreferee/workflows/Linux%20Build/badge.svg
[linux-build]: https://github.com/wesley-221/wyreferee/actions?query=workflow%3A%22Linux+Build%22
[macos-build-badge]: https://github.com/wesley-221/wyreferee/workflows/MacOS%20Build/badge.svg
[macos-build]: https://github.com/wesley-221/wyreferee/actions?query=workflow%3A%22MacOS+Build%22
[windows-build-badge]: https://github.com/wesley-221/wyreferee/workflows/Windows%20Build/badge.svg
[windows-build]: https://github.com/wesley-221/wyreferee/actions?query=workflow%3A%22Windows+Build%22
