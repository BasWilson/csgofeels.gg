var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path')
var timer = require('./modules/timer');
var io = require('socket.io')(http);
var sha256 = require('js-sha256');
var randomFloat = require('random-float');
var dice = require('./dice');

exports.calculateDice = function (f1, f2, f3, f4, dicePercentage, diceData) {
  f1 = randomFloat(1, 100);
  f2 = randomFloat(1, 100);
  f3 = randomFloat(1, 100);
  f4 = randomFloat(1, 100);
  dicePercentage = f1+f2+f3+f4;
  dicePercentage = dicePercentage / 4;
  console.log('Calculated dice percentage: '+dicePercentage);

  var n = dicePercentage.toFixed(2);

  if (dicePercentage > diceData.winChance) {
    socket.emit('wonDice');
  } else if (dicePercentage < diceData.winChance) {
    socket.emit('lostDice');
  }

};

exports.verifyDice = function (diceData) {
  if (diceData.betAmount <= 0.0) {
    socket.emit('invalidDiceBet');
  } else {
    //Check if dice was correctly calculated
    diceData.multiplier = diceData.percentage * 0.04;
    diceData.multiplier = diceData.multiplier.toFixed(2);
    if (diceData.multiplier == diceData.profitOnWin) {
      console.log(diceData);

      calculateDice(diceData);
    }
  }

};
