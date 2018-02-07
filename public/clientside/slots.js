var user;

setTimeout(function () {
  user = firebase.auth().currentUser;
}, 500);

var slotsData = {
  betAmount: 0,
  userID: 0,
  gameID: 0,
  gameMode: 'slots',
  username: Cookies.get('username'),
  win: false
};

function setBalance(win) {

  if (win == true) {
    var newBalance = parseFloat(Cookies.get('balance'));
    var winAmount = parseFloat(slotsData.profitOnWin) - parseFloat(slotsData.betAmount);
    newBalance = newBalance + winAmount;
    newBalance = newBalance.toFixed(2);
    $('#balance').text(newBalance+" COINS");
    Cookies.set('balance', newBalance);
  } else {
    var newBalance = parseFloat(Cookies.get('balance'));
    newBalance = newBalance - parseFloat(slotsData.betAmount);
    newBalance = newBalance.toFixed(2);
    $('#balance').text(newBalance+" COINS");
    Cookies.set('balance', newBalance);
  }
}


$("#spinSlotsBtn").click(function() {

  //Get the bet and then tell the socket we're ready to roll
  slotsData.betAmount = document.getElementById('betAmountField').value;
  slotsData.userID = user.uid;
  socketSpinSlots(slotsData);

});
