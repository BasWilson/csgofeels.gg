var socket = io();
var activeGame = false;
var user;
var over = true;

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

  document.getElementById('percentageField').value = dice.percentage + "%";

  if (over == false) {
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

$("#clearbutton").click(function() {
  document.getElementById("betAmountField").value = "";
});

$("#halfbutton").click(function() {
  var bet = document.getElementById("betAmountField").value;
  bet = bet / 2;
  document.getElementById("betAmountField").value = bet.toFixed(2);
});

$("#x2button").click(function() {
  var bet = document.getElementById("betAmountField").value;
  bet = bet * 2;
  document.getElementById("betAmountField").value = bet.toFixed(2);
});

$("#maxbutton").click(function() {
  var max = Cookies.get('balance');
  document.getElementById("betAmountField").value = max;
});
$("#minbutton").click(function() {
  document.getElementById("betAmountField").value = 0.1;
});
$("#overswitch").click(function() {
  if (over == true) {
    over = false;
  } else {
    over = true;
  }
  console.log(over);
});

socket.on('playerCount', function (playercount) { // Show the online player count
  $("#playerCount").text("Online Players: " + playercount);
});
