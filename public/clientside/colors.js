var activeGame = false;
var user;

setTimeout(function () {
  user = firebase.auth().currentUser;
  colors.userID = user.uid;
}, 500);

var local = {
  profitOnWin: 0
};

var colors = {
  betAmount: 0,
  color: 0,
  userID: 0,
  gameID: 0,
  gameMode: 'colors'
};

setInterval(function(){
  colors.betAmount = document.getElementById("betAmountField").value;
  local.profitOnWin = colors.betAmount * 4;
  local.profitOnWin = local.profitOnWin.toFixed(2);
  document.getElementById('profitOnWin').innerHTML = local.profitOnWin;
}, 20);

function startColorsRoll(colorsGame) {
    setInterval(function() {
      $("#colors").css("background-color", "red");
    }, colorsGame.speed)
    setInterval(function() {
      $("#colors").css("background-color", "yellow");
    }, colorsGame.speed)
    setInterval(function() {
      $("#colors").css("background-color", "green");
    }, colorsGame.speed)
    setInterval(function() {
      $("#colors").css("background-color", "blue");
    }, colorsGame.speed)
}



//Colors: 0 = red, green = 1, yellow = 2, blue = 3;
$("#redBtn").click(function() {
  colors.color = 0;
  socket.emit('colorsData', colors);
  startColorsRoll();
});
$("#greenBtn").click(function() {
  colors.color = 1;
  socket.emit('colorsData', colors);
});
$("#yellowBtn").click(function() {
  colors.color = 2;
  socket.emit('colorsData', colors);
});
$("#blueBtn").click(function() {
  colors.color = 3;
  socket.emit('colorsData', colors);
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

socket.on('colorsResult', function (colorsResult) {

});

socket.on('colorsGame', function (colorsGame) {
  startColorsRoll(colorsGame);
});
