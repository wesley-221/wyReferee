# Introduction
Welcome to the AxS calculator. With this application you can calculate the scores with the AxS score format. 

# Config file
The config file can be found in `%appdata%/AxSCalculator`. This is the only place where things will be saved.

# Compiling
To compile the application yourself, you have to follow the following steps:

- Download and install [Node.js](https://nodejs.org/en/)
- Download the repository
- Run the command `npm install` in the dir of the repository and wait for it to download all the packages
- To run the application locally, run `npm start`
- To compile the application into an executable, run `npm run electron:windows` or check the `package.json` for different OS support (can't guarantee that anything besides windows will work)
- The compiled files will be placed in `/release/`
