# Hobbe Backend Server

[![Status](https://img.shields.io/badge/build-passing-green.svg?branch=master)](https://github.com/AbdeenM/hobee-backend)
[![Node JS](https://img.shields.io/badge/Node%20JS-v10.16.0-green.svg?logo=nodejs)](https://nodejs.org/)
[![Nodemon](https://img.shields.io/badge/Modemon-v1.18.10-brightgreen.svg?logo=nodemon)](https://nodemon.io/)
[![Babel](https://img.shields.io/badge/Babel-v6.26.0-yellow.svg?logo=babel)](https://babeljs.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6.0.1-green.svg?logo=mongodb)](https://www.mongodb.com/)
[![Expo](https://img.shields.io/badge/Expo-SDK35.0.0-black.svg?logo=expo)](https://expo.io/)
[![Socket IO](https://img.shields.io/badge/Socket.io-v2.2.0-black.svg?logo=socket.io)](https://socket.io/)

## Features

* [Node JS](https://nodejs.org/)
* [Socket IO](https://socket.io/)
* [MongoDB](https://www.mongodb.com/)
* [Expo Server SDK](https://expo.io/)
* [Passport JS](http://www.passportjs.org/)
* [Babel](https://babeljs.io/)
* [Nodemon](https://nodemon.io/)

... and many more, check the package.json file for all the libraries used.

## Prerequisites

* A comfortable development enviroment
* [Node](https://nodejs.org/) v10.16.0 (it is recommended to install it via [NVM](https://github.com/creationix/nvm/))
* [NPM](https://npmjs.com/) or [Yarn](https://https://yarnpkg.com/)

## Installation

Following this assumes you have everything setup, to install the project either download the .zip file and extract or navigate to an empty directory and clone this repo:
```bash
git clone https://github.com/AbdeenM/hobee-backend.git
```
Once you have the project files downloaded navigate to where the `package.json` file is in your directory and run `npm install` or `yarn install` depending on what you have as a package manager.

## Getting Started

1. Modify `constants/config.js` with your details respectively.
  * `SERVER_URL:` place your current servers url.
  * `DB)URL:` you can leave this as is or modify the "hobee" string to whatever you like. (This is the name of your db).
  * `JWT_SECRET:` you can leave this as is or modify it. (This is your passport secret, can be any random string).
2. Run `npm run build:watch` on the project root directory, to build your `dist/` file which will be your compiled source code
3. Run on a new terminal instancec `npm run dev` on your project root directory, to run the server.
4. Now sit back relax and enjoy exploring the application!

**Note: On a production enviroment you can use [PM2](https://pm2.keymetrics.io) to manage your application (Highly Recommended!)**

## Project Status

This project has great potential for improvements, currently i wont be updating or modifying it due to time shortage but feel free to contribute!

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please make sure to update tests as appropriate.

## License

**Hobee** © 2018+, Released under the **[MIT License](http://mit-license.org/)**
Authored and maintained by **[Abdeen Mohamed](https://github.com/AbdeenM)**
