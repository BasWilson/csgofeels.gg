var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path')
var io = require('socket.io')(http);

var userdata = require('../modules/userdata');
var general = require('../modules/general');

//Gamemodes
var colors = require('../modules/colors');
var dice = require('../modules/dice');
var slots = require('../modules/slots');

module.exports = {
  getGamemode: function (gameData, socket) {
    switch(gameData.gameMode) {
        case 'dice':
            dice.joinDiceGameMode(gameData, socket);
            break;
        case 'colors':
            colors.joinColorsGameMode(gameData, socket);
            break;
        case 'slots':
            slots.joinSlotsGameMode(gameData, socket);
            break;
        default:
            //Do nothing just yet
    }
  }
};
