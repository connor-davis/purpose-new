const chalk = require("chalk");
const moment = require("moment");

/**
 * The success logger function.
 * 
 * @param {string} message The message to be output to the console.
 */
const success = (message) => {
    let daystamp = chalk.hex('#c7e057').bold(moment().format('DD/MM/YYYY'));
    let timestamp = chalk.hex('#ffffff').bold(moment().format('HH:MM:SS'));
    let messageColored = chalk.hex('#22c55e').visible(message);
  
    console.log(`${daystamp} - ${timestamp} - ${messageColored}`);
};

/**
 * The warn logger function.
 * 
 * @param {string} message The message to be output to the console.
 */
const warn = (message) => {
    let daystamp = chalk.hex('#262626').bold(moment().format('DD/MM/YYYY'));
    let timestamp = chalk.hex('#ffffff').bold(moment().format('HH:MM:SS'));
    let messageColored = chalk.hex('#eab308').visible(message);
  
    console.log(`${daystamp} - ${timestamp} - ${messageColored}`);
};

/**
 * The error logger function.
 * 
 * @param {string} message The message to be output to the console.
 */
const error = (message) => {
    let daystamp = chalk.hex('#262626').bold(moment().format('DD/MM/YYYY'));
    let timestamp = chalk.hex('#ffffff').bold(moment().format('HH:MM:SS'));
    let messageColored = chalk.hex('#ef4444').visible(message);
  
    console.log(`${daystamp} - ${timestamp} - ${messageColored}`);
};

/**
 * The info logger function.
 * 
 * @param {string} message The message to be output to the console.
 */
const info = (message) => {
    let daystamp = chalk.hex('#c7e057').bold(moment().format('DD/MM/YYYY'));
    let timestamp = chalk.hex('#ffffff').bold(moment().format('HH:MM:SS'));
    let messageColored = chalk.hex('#a3a3a3').visible(message);
  
    console.log(`${daystamp} - ${timestamp} - ${messageColored}`);
};

module.exports = {
  success,
  info,
  warn,
  error,
};
