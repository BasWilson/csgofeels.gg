module.exports = {

  joinSlotsGameMode: function (gameData, socket) {

    spinSlots(gameData, socket);

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
var main = require('../main');

function spinSlots(gameData, socket, slot1, slot2, slot3, slot4) {

  //calcualte slots
  slot1 = randomFloat(1, 100);
  slot2 = randomFloat(1, 100);
  slot3 = randomFloat(1, 100);

  // The id of each game, TODO Make it 100% unique
  var gameID = slot1 * slot2 * slot3;
  gameID = gameID.toFixed(0);
  gameData.gameID = gameID;

  //Remove decimals from slot numbers
  slot1 = slot1.toFixed(0);
  slot2 = slot2.toFixed(0);
  slot3 = slot3.toFixed(0);

  //Append slot numbers to the object
  gameData.slot1 = slot1;
  gameData.slot2 = slot2;
  gameData.slot3 = slot3;

  console.log('Slot 1: '+ slot1);
  console.log('Slot 2: '+ slot2);
  console.log('Slot 3: '+ slot3);

  /*
  Possible spin:
  - spin1 0% - 50%
  - spin2 50% - 75%
  - spin3 75% - 90%
  - spin4 90% - 97.5%
  - spin5 97.5% - 100%

  Slot winning combinations:

  - combination 1: 1x spin1 = x0.5
  - combination 2: 2x spin1 = x1.5
  - combination 3: 3x spin1 = x2.0

  - combination 4: 1x spin2 = x1.0
  - combination 5: 2x spin2 = x3.0
  - combination 6: 3x spin2 = x5.0

  - combination 7: 2x spin3 = x4.0
  - combination 8: 3x spin3 = x6.0

  - combination 9: 3x spin4 = x25.0

  - combination 10: 3x spin5 = x50.0

    Everything else is  no money <3
  */

  //Combination 1
  if (slot1 >= 0 && slot1 >= 50) {
    console.log('combo 1');
  }
  //Combination 2
  if (slot1 >= 0 && slot1 >= 50 && slot2 >= 0 && slot2 <= 50) {
    console.log('combo 2');
  }
  //Combination 3
  if (slot1 >= 0 && slot1 >= 50 && slot2 >= 0 && slot2 <= 50 && slot3 >= 0 && slot3 >= 50) {
    console.log('combo 3');
  }
  //Combination 4
  if (slot1 >= 50 && slot1 >= 75) {
    console.log('combo 4');
  }
  //Combination 5
  if (slot1 >= 50 && slot1 >= 75 && slot2 >= 50 && slot2 <= 75) {
    console.log('combo 5');
  }
  //Combination 6
  if (slot1 >= 50 && slot1 >= 75 && slot2 >= 50 && slot2 <= 75 && slot3 >= 50 && slot3 >= 75) {
    console.log('combo 6');
  }
  //Combination 7
  if (slot1 >= 75 && slot1 >= 90 && slot2 >= 75 && slot2 <= 90) {
    console.log('combo 7');
  }
  //Combination 8
  if (slot1 >= 75 && slot1 >= 90 && slot2 >= 75 && slot2 <= 90 && slot3 >= 75 && slot3 >= 90) {
    console.log('combo 8');
  }
  //Combination 9
  if (slot1 >= 90 && slot1 >= 97.5 && slot2 >= 90 && slot2 <= 97.5 && slot3 >= 90 && slot3 >= 97.5) {
    console.log('combo 9');
  }
  //Combination 10
  if (slot1 >= 97.5 && slot1 >= 100 && slot2 >= 97.5 && slot2 <= 100 && slot3 >= 97.5 && slot3 >= 100) {
    console.log('combo 10');
  }
  /*
  //Payout slots and do other database stuff
  if (gameData.over == true) { // if the user is rolling over the percentage
    if (dicePercentage > gameData.chosenPercentage) {
      gameData.win = true;
      socket.emit('wonDice', dicePercentage);
  if (gameData.profitOnWin > 299) {
      socket.broadcast.emit('highRoller', gameData);
  }
      userdata.writeDiceGameToDB(gameData); //Read the function above
      userdata.addBalance(gameData); // ^^
    } else if (dicePercentage < gameData.chosenPercentage) {
      gameData.win = false;
      socket.emit('lostDice', dicePercentage);
      userdata.writeDiceGameToDB(gameData);
      userdata.removeBalance(gameData);
    }
  } else { // if the user is rolling under the percentage
    if (dicePercentage < gameData.winChance) {
      gameData.win = true;
      socket.emit('wonDice', dicePercentage);
    if (gameData.profitOnWin > 299) {
        socket.broadcast.emit('highRoller', gameData);
    }
      userdata.writeDiceGameToDB(gameData);
      userdata.addBalance(gameData);
    } else if (dicePercentage > gameData.winChance) {
      gameData.win = false;
      socket.emit('lostDice', dicePercentage);
      userdata.writeDiceGameToDB(gameData);
      userdata.removeBalance(gameData);
    }
  }
  main.emitDiceGameToRecents(gameData);
  */
}
