var socket = io();
var activeGame = false;
var user;

setTimeout(function () {
  user = firebase.auth().currentUser;
}, 500);

var dice = {
  percentage: 0,
  multiplier: 0,
  winChance: 0,
  profitOnWin: 0,
  betAmount: 0,
  over: true,
  userID: 0,
  gameID: 0
};

function setBalance(win) {

  if (win == true) {
    var newBalance = parseFloat(Cookies.get('balance'));
    var winAmount = parseFloat(dice.profitOnWin) - parseFloat(dice.betAmount);
    newBalance = newBalance + winAmount;
    newBalance = newBalance.toFixed(2);
    $('#balance').text(newBalance+" COINS");
    Cookies.set('balance', newBalance);
  } else {
    var newBalance = parseFloat(Cookies.get('balance'));
    newBalance = newBalance - parseFloat(dice.betAmount);
    newBalance = newBalance.toFixed(2);
    $('#balance').text(newBalance+" COINS");
    Cookies.set('balance', newBalance);
  }
}
setInterval(function(){
  dice.percentage = document.getElementById("percentageField").value;
  dice.percentage = document.getElementById("sliderDice").value;
  dice.multiplier = document.getElementById("multiplierField").value;
  dice.winChance = document.getElementById("winchanceField").value;
  dice.betAmount = document.getElementById("betAmountField").value;



  //calc profit on win REDO OBVIOUSLY
  dice.multiplier = dice.percentage * 0.04;

  //
  dice.multiplier = dice.multiplier.toFixed(2);
  dice.profitOnWin = dice.multiplier * dice.betAmount;
  dice.profitOnWin = dice.profitOnWin.toFixed(2);
  document.getElementById('multiplierField').value = dice.multiplier;
  document.getElementById('profitOnWin').innerHTML = dice.profitOnWin;

  var overunder = document.getElementById("overunder").checked;
  document.getElementById('percentageField').value = dice.percentage + "%";

  if (overunder == true) {
    $("#overundertext").text("ROLLING UNDER");
    document.getElementById("overundertext").style.color = "white" ;
    dice.over = false;
    document.getElementById('winchanceField').value = dice.percentage + "%";
  } else {
    dice.over = true;
    document.getElementById("overundertext").style.color = "rgb(244, 75, 66)" ;
    $("#overundertext").text("ROLLING OVER");
    document.getElementById('winchanceField').value = 100 - dice.percentage + "%";
  }

}, 20);


$("#rollBTN").click(function() {
  dice.userID = user.uid;
  socket.emit('diceData', dice);
});



socket.on('playerCount', function (playercount) { // Show the online player count
  $("#playerCount").text("Online Players: " + playercount);
});
