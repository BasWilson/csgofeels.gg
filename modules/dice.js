module.exports = {

  joinDiceGameMode: function (gameData, socket) {
    //socket.join('DiceRoom');
    //console.log('Dice room joined');
    rollDice(gameData, socket);

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

function rollDice(gameData, socket, d1, d2, d3, d4, dicePercentage) {

  //calcualte dice number
  d1 = randomFloat(1, 100);
  d2 = randomFloat(1, 100);
  d3 = randomFloat(1, 100);
  d4 = randomFloat(1, 100);
  dicePercentage = d1; // This is the final dice percentage, you could add to it like d1 + d2 + d3. but not recommended.
  var gameID = dicePercentage * d2 * d4 * d3 * d1 * d2; // The id of each game, TODO Make it 100% unique
  gameID = gameID.toFixed(0);
  gameData.gameID = gameID;
  dicePercentage = dicePercentage.toFixed(2);
  console.log('Calculated dice percentage: '+dicePercentage);

  //Payout dice and do other database stuff
  if (gameData.over == true) { // if the user is rolling over the percentage
    if (dicePercentage > gameData.percentage) {
      socket.emit('wonDice', dicePercentage);
  if (gameData.profitOnWin > 299) {
      io.emit("highRoller", gameData);
      console.log('highroller');
  }
      userdata.writeDiceGameToDB(gameData); //Read the function above
      userdata.addBalance(gameData); // ^^
    } else if (dicePercentage < gameData.percentage) {
      socket.emit('lostDice', dicePercentage);
      userdata.writeDiceGameToDB(gameData);
      userdata.removeBalance(gameData);
    }
  } else { // if the user is rolling under the percentage
    if (dicePercentage < gameData.winChance) {
      socket.emit('wonDice', dicePercentage);
    if (gameData.profitOnWin > 299) {
        io.emit("highRoller", gameData);
    }
      userdata.writeDiceGameToDB(gameData);
      userdata.addBalance(gameData);
    } else if (dicePercentage > gameData.winChance) {
      socket.emit('lostDice', dicePercentage);
      userdata.writeDiceGameToDB(gameData);
      userdata.removeBalance(gameData);
    }
  }
}
