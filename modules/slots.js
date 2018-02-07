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


function spinSlots(gameData, socket, slot1, slot2, slot3) {

  //COMBO ID's
  var c1 = false, c2 = false, c3 = false, c4 = false, c5 = false, c6 = false, c7 = false, c8 = false, c9 = false ,c10 = false, c11 = false, c12 = false, c13 = false, c14 = false, c15 = false;

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
  if (slot1 <= 50) {
    c1 = true;
  } else if (slot1 >= 50 && slot1 <= 75) {
    c2 = true;
  } else if (slot1 >= 76 && slot1 <= 90) {
    c3 = true;
  } else if (slot1 >= 91 && slot1 <= 97.5) {
    c4 = true;
  } else if (slot1 >= 97.6 && slot1 <= 100) {
    c5 = true;
  }
  if (slot2 <= 50) {
    c6 = true;
  } else if (slot2 >= 50 && slot2 <= 75) {
    c7 = true;
  } else if (slot2 >= 76 && slot2 <= 90) {
    c8 = true;
  } else if (slot2 >= 91 && slot2 <= 97.5) {
    c9 = true;
  } else if (slot2 >= 97.6 && slot2 <= 100) {
    c10 = true;
  }
  if (slot3 <= 50) {
    c11 = true;
  } else if (slot3 >= 50 && slot3 <= 75) {
    c12 = true;
  } else if (slot3 >= 76 && slot3 <= 90) {
    c13 = true;
  } else if (slot3 >= 91 && slot3 <= 97.5) {
    c14 = true;
  } else if (slot3 >= 97.6 && slot3 <= 100) {
    c15 = true;
  }

  //x0.5, x1.5, and x2
  if (c1 == true && c6 == false && c11 == false) {
    gameData.profitOnWin = gameData.betAmount * 0.5;
    gameData.win = true;
  } else if (c1 == true && c6 == true && c11 == false) {
    gameData.profitOnWin = gameData.betAmount * 1.5;
    gameData.win = true;
  } else if (c1 == true && c6 == true && c11 == true) {
    gameData.profitOnWin = gameData.betAmount * 2;
    gameData.win = true;
  }


  //x1, x3, and x5
  if (c2 == true && c7 == false && c12 == false) {
    gameData.profitOnWin = gameData.betAmount * 1.0;
    gameData.win = true;
  } else if (c2 == true && c7 == true && c12 == false) {
    gameData.profitOnWin = gameData.betAmount * 3.0;
    gameData.win = true;
  } else if (c2 == true && c7 == true && c12 == true) {
    gameData.profitOnWin = gameData.betAmount * 5.0;
    gameData.win = true;
  }

  //x4 and x6
  if (c3 == true && c8 == true && c13 == false) {
    gameData.profitOnWin = gameData.betAmount * 4.0;
    gameData.win = true;
  } else if (c3 == true && c8 == true && c13 == true) {
    gameData.profitOnWin = gameData.betAmount * 6.0;;
    gameData.win = true;
  }

  //x25
  if (c4 == true && c9 == true && c14 == true) {
    gameData.profitOnWin = gameData.betAmount * 25.0;
    gameData.win = true;
  }

  //x50
  if (c5 == true && c10 == true && c15 == true) {
    gameData.profitOnWin = gameData.betAmount * 50.0;
    gameData.win = true;
  }

  //reset all c's
  c1 = false, c2 = false, c3 = false, c4 = false, c5 = false, c6 = false, c7 = false;
  c8 = false, c9 = false , c10 = false, c11 = false, c12 = false, c13 = false, c14 = false, c15 = false;

  //Payout slots and do other database stuff
  if (gameData.win == true) {

    if (gameData.profitOnWin >= 50) {
      socket.broadcast.emit('highRoller', gameData);
    }

    socket.emit('wonSlots', gameData);

    //Start the database process
    userdata.writeSlotsGameToDB(gameData);
    userdata.addBalance(gameData);

  } else if (gameData.win == false) {

    //Stop it all, he lost it <3
    socket.emit('lostSlots', gameData);

    //Start the database process
    userdata.writeSlotsGameToDB(gameData);
    userdata.removeBalance(gameData);
  }
  main.emitSlotsGameToRecents(gameData);
}
