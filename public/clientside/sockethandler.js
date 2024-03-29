var socket = io();

////////////////
//HANDLE PLAYERS
////////////////
socket.on('playerCount', function (playercount) { // Show the online player count
  $("#playerCount").text("Online Players: " + playercount);
});

//////////
//CHAT
//////////
function socketSendMessage(data) {
  socket.emit('message', data);
}

socket.on('message', function (data) {
  receiveMessage(data);
});

//////////////
//BET HANDLING
//////////////
socket.on('highRoller', function (gameData) {
  showHighRoller(gameData);
});

///////////
//BALANCE
///////////
socket.on('balance', function () {
    getBalance();
});

socket.on('invalidBalance', function (text) {
  text = "You don't have enough balance!";
  showGenericPopup(text);
});

//////////
//Dice
//////////
function socketRollDice(dice) {
  socket.emit('diceData', dice);
}

socket.on('wonDice', function (dicePercentage) {
  wonDice(dicePercentage);
});

socket.on('lostDice', function (dicePercentage) {
  lostDice(dicePercentage);
});

socket.on('recentDiceGame', function (recentGameData) {
  appendRecentDiceGame(recentGameData);
});

//////////
//SLOTS
//////////
function socketSpinSlots(gameData) {
  socket.emit('slotsData', gameData);
}
socket.on('wonSlots', function (gameData) {
  wonSlots(gameData);
});

socket.on('lostSlots', function (gameData) {
  lostSlots(gameData);
});
socket.on('recentSlotsGame', function (recentGameData) {
  appendRecentSlotsGame(recentGameData);
});

///////////
//TIPPING
///////////
function socketSendTip(tipData) {
  socket.emit('sendTip', tipData);
}

socket.on('invalidTip', function (text) {
  invalidTip(text);
});
