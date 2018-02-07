var user;
var recentCounter = 0;

setTimeout(function () {
  user = firebase.auth().currentUser;
}, 500);

var slotsData = {
  betAmount: 0,
  userID: 0,
  gameID: 0,
  gameMode: 'slots',
  username: Cookies.get('username'),
  win: false,
  profitOnWin: 0,
  slot1: 0,
  slot2: 0,
  slot3: 0
};

function setBalance(gameData, win) {

  if (win == true) {
    var newBalance = parseFloat(Cookies.get('balance'));
    var winAmount = parseFloat(gameData.profitOnWin) - parseFloat(gameData.betAmount);
    newBalance = newBalance + winAmount;
    newBalance = newBalance.toFixed(2);
    $('#balance').text(newBalance+" COINS");
    Cookies.set('balance', newBalance);
  } else {
    var newBalance = parseFloat(Cookies.get('balance'));
    newBalance = newBalance - parseFloat(gameData.betAmount);
    newBalance = newBalance.toFixed(2);
    $('#balance').text(newBalance+" COINS");
    Cookies.set('balance', newBalance);
  }
}


$("#spinSlotsBtn").click(function() {

  //Get the bet and then tell the socket we're ready to spin
  slotsData.betAmount = document.getElementById('betAmountField').value;
  slotsData.userID = user.uid;
  socketSpinSlots(slotsData);

});

function wonSlots(gameData) {
  var win = true;
  $("#output").text("Spinned: "+ gameData.slot1 + ", " + gameData.slot2 + " and " + gameData.slot3 + ", You won " + gameData.profitOnWin + ' coins!');
  document.getElementById("output").style.color = "white" ;
  var text = gameData.slot1 + ", " + gameData.slot2 + " and " + gameData.slot3 + ",  you won " + gameData.profitOnWin + ' coins!';
  showGenericPopup(text);
  setBalance(gameData, win);
}

function lostSlots(gameData) {
  var win = false;
  $("#output").text(gameData.slot1 + ", " + gameData.slot2 + " and " + gameData.slot3 + ", You lost " + gameData.betAmount + ' coins!');
  document.getElementById("output").style.color = "rgb(244, 75, 66)" ;

  var text = gameData.slot1 + ", " + gameData.slot2 + " and " + gameData.slot3 + ",  you lost " + gameData.betAmount  + ' coins!';
  showGenericPopup(text);
  setBalance(gameData, win);
}

function appendRecentSlotsGame(gameData, recentGame) {
  var win = gameData.win;

  if (recentCounter >= 25) {
    $( ".recents" ).remove();
    recentCounter = 0;
  } else {
    if (win == false) {
      //user lost money
      recentGame = '<tr class="recents" ><td>'+gameData.betAmount+'</td><td>'+gameData.username+'</td><td style="color: red;">- '+gameData.betAmount+'</td></tr>';
    } else {
      recentGame = '<tr class="recents" ><td>'+gameData.betAmount+'</td><td>'+gameData.username+'</td><td style="color: green;">'+gameData.profitOnWin+'</td></tr>';
    }
    recentCounter++;
    $("#recentGames").append(recentGame);
  }


}
