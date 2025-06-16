# Contributing to wyReferee

# Table of contents
1. [Reporting bugs](reporting-bugs)
2. [Requesting features](#requesting-features)
3. [Setting up a development installation](#setting-up-a-development-installation)

## Reporting bugs

### Before creating an issue:
- Check that the bug hasn't been reported in an existing issue. 
- Make sure you are running the latest version of wyReferee

### When creating an issue
- Select the `Bug report` issue template and fill out all fields
- Please provide detailed instructions on how to reproduce the bug, if possible

## Requesting features
Feature requests are always welcome. Select the `Feature request` issue template and fill out all fields.

## Setting up a development installation
Note: This assumes that you are already familiar with Git.

The easiest way to make and test changes is by setting up a development installation, in which wyReferee runs directly from a local copy of the repository.

1. Clone the repository using this command:
```bash
git clone git@github.com:wesley-221/wyReferee.git
```
2. Go to the actual folder on your computer where you cloned wyReferee (ie. C:\xx\wyReferee\)
```bash
cd wyReferee
```
3. Install all dependencies
```bash
yarn install
```
4. Start wyReferee from the repository by using this command:
```bash
npm start
```

To build an executeable for any of the operating systems, you can use one of the following commands to build one:
- For Windows: `yarn run electron:windows`
- For Mac: `yarn run electron:mac`
- For Linux: `yarn run electron:linux`
