module.exports = {

  calculateExperience: function (gameData, socket) {
    var exp = 0;
    exp = gameData.betAmount * 0.1;
    userdata.writeExperienceToDB(gameData, socket, exp);
  },

};

var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path')
var io = require('socket.io')(http);

var sha256 = require('js-sha256');
var randomFloat = require('random-float');

var userdata = require('../modules/userdata');
var general = require('../modules/general');

/*
EXPERIENCE LEVELS

A users level increases when he/she bets coins.

Every bet is multiplied by 0.1, the result is the EXP you earned from that bet

Level 1: 10xp, reward = 1 coins
Level 2: 50xp, reward = 5 coins
Level 3: 100xp, reward = 10 coins
Level 4: 250xp, reward = 25 coins
Level 5: 500xp, reward = 100 coins
Level 6: 1000xp, reward = 100 coins
Level 7: 2000xp, reward = 100 coins
Level 8: 3000xp, reward = 100 coins
Level 9: 5000xp, reward = 100 coins
Level 10: 10000xp, reward = 100 coins

EXAMPLE

To get to Level 1, you have to bet 100 * 0.1 = 10xp

*/
