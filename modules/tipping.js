//ADMIN
var admin = require('firebase-admin');
var refreshToken; // Get refresh token from OAuth2 flow

// Get a reference to the database service
var database = admin.database();

module.exports = {
  getBalanceForTip: function (tipData, socket) {

    //Read user's balance from the database
    admin.database().ref('/users/' + tipData.senderUid + '/properties/').once('value').then(function(snapshot) {
      var balance = (snapshot.val() && snapshot.val().balance);
      balance = parseFloat(balance);
      var tip = parseFloat(tipData.tipAmount);
      console.log(tip);
      if (balance < tip) { // Check if the user's balance is less then the tip
        socket.emit('invalidTip'); // Not enough balance, <3
        console.log("Not enough balance to tip");
        return false;
      } if (true) { //If user did have enough, we return true and continue the dice function
        tipPlayer(tipData);
      } else {
        // Not enough balance, <3. Stop it all.
      }
      });
  }
};

function tipPlayer(tipData) {

  var senderBalanceRef = admin.database().ref('users/' + tipData.senderUid + '/properties/');

  senderBalanceRef.transaction(function(balance) {
    if (balance) {
      if (balance.balance && balance.balance[tipData.senderUid]) {
        //If anything in the transaction went wrong or the user tried to mess with it, it will be restored.
        var newBalance = parseFloat(balance.balance) - parseFloat(tipData.tipAmount);
        balance.balance = parseFloat(newBalance).toFixed(2);
        balance.balance[tipData.senderUid] = null;
      } else {
        //Pays the profitOnWin var from the user out if he/she wins
        var newBalance = parseFloat(balance.balance) - parseFloat(tipData.tipAmount);
        balance.balance = parseFloat(newBalance).toFixed(2);
        if (!balance.balance) {
          balance.balance = {};
        }
        balance.balance[tipData.senderUid] = true;
      }
    }
    return balance;
  });

  var receiverBalanceRef = admin.database().ref('users/' + tipData.receiverUid + '/properties/');

  receiverBalanceRef.transaction(function(balance) {
    if (balance) {
      if (balance.balance && balance.balance[tipData.receiverUid]) {
        //If anything in the transaction went wrong or the user tried to mess with it, it will be restored.
        var newBalance = parseFloat(balance.balance) - parseFloat(tipData.tipAmount);
        balance.balance = parseFloat(newBalance).toFixed(2);
        balance.balance[tipData.receiverUid] = null;
      } else {
        //Pays the profitOnWin var from the user out if he/she wins
        var newBalance = parseFloat(balance.balance) + parseFloat(tipData.tipAmount);
        balance.balance = parseFloat(newBalance).toFixed(2);
        if (!balance.balance) {
          balance.balance = {};
        }
        balance.balance[tipData.receiverUid] = true;
      }
    }
    return balance;
  });

}
