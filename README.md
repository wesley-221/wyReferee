# Introduction
This client allows you to create, manage, publish and import both mappools and tournaments. It has a lot of QoL features for osu! multiplayer lobbies, such as picking maps from a mappool with just a single click on a button. 

# Config file
The config file can be found in `%appdata%/wyreferee`. This is the only place where things will be saved.

# Compiling
To compile the application yourself, you have to follow the following steps:

- Download and install [Node.js](https://nodejs.org/en/)
- Download the repository
- Run the command `npm install` in the dir of the repository and wait for it to download all the packages
- To run the application locally, run `npm start`
- To compile the application into an executable, run `npm run electron:windows` or check the `package.json` for different OS support (can't guarantee that anything besides windows will work)
- The compiled files will be placed in `/release/`
