module.exports = {

  //This function will check the users balance and then continues to the given game mode
  getBalance: function (gameData, socket) {

        //Read user's balance from the database
        admin.database().ref('/users/' + gameData.userID + '/properties/').once('value').then(function(snapshot) {
          var balance = (snapshot.val() && snapshot.val().balance);
          balance = parseFloat(balance);
          var bet = parseFloat(gameData.betAmount);
          if (balance < bet) { // Check if the user's balance is less then the bet
            socket.emit('invalidBalance'); // Not enough balance, <3
            return false;
          } if (true) { //If user did have enough, we return true and continue the dice function
            general.getGamemode(gameData, socket); // Check what gamemode the user is betting on
          } else {
            // Not enough balance, <3. Stop it all.
          }
          });
  },

  //This function adds balance if someone wins a game
  addBalance: function (gameData, socket) {

    var balanceRef = admin.database().ref('users/' + gameData.userID + '/properties/');

    balanceRef.transaction(function(balance) {
      if (balance) {
        if (balance.balance && balance.balance[gameData.userID]) {
          //If anything in the transaction went wrong or the user tried to mess with it, it will be restored.
          var newBalance = parseFloat(balance.balance) - parseFloat(gameData.betAmount);
          balance.balance = parseFloat(newBalance).toFixed(2);
          balance.balance[gameData.userID] = null;
        } else {
          //Pays the profitOnWin var from the user out if he/she wins
          var newBalance = parseFloat(balance.balance) + parseFloat(gameData.profitOnWin) - parseFloat(gameData.betAmount);
          balance.balance = parseFloat(newBalance).toFixed(2);
          if (!balance.balance) {
            balance.balance = {};
          }
          balance.balance[gameData.userID] = true;
        }
      }
      return balance;
    });

  },

  removeBalance: function (gameData, socket) {

    var balanceRef = admin.database().ref('users/' + gameData.userID + '/properties/');

    balanceRef.transaction(function(balance) {
      if (balance) {
        if (balance.balance && balance.balance[gameData.userID]) {
          //If anything in the transaction went wrong or the user tried to mess with it, it will be restored.
          var newBalance = parseFloat(balance.balance) + parseFloat(gameData.betAmount);
          balance.balance = parseFloat(newBalance).toFixed(2);
          balance.balance[gameData.userID] = null;
        } else {
          //takes the betAmount var from the user if he loses
          var newBalance = parseFloat(balance.balance) - parseFloat(gameData.betAmount);
          balance.balance = parseFloat(newBalance).toFixed(2);
          if (!balance.balance) {
            balance.balance = {};
          }
          balance.balance[gameData.userID] = true;
        }
      }
      return balance;
    });
  },

  writeDiceGameToDB: function (gameData, socket) {

    admin.database().ref('users/' + gameData.userID + '/dice/games/' + gameData.gameID).set({
      userID: gameData.userID,
      bet: gameData.betAmount,
      profit: gameData.profitOnWin,
      gameID: gameData.gameID,
      username: gameData.username,
      win: gameData.win,
      rolledPercentage: gameData.rolledPercentage,
      chosenPercentage: gameData.chosenPercentage
    });
    admin.database().ref('games/dice/' + gameData.gameID).set({
      userID: gameData.userID,
      bet: gameData.betAmount,
      profit: gameData.profitOnWin,
      gameID: gameData.gameID,
      username: gameData.username,
      win: gameData.win,
      rolledPercentage: gameData.rolledPercentage,
      chosenPercentage: gameData.chosenPercentage
    });

  },
};

var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path')
var io = require('socket.io')(http);

var userdata = require('../modules/userdata');
var general = require('../modules/general');

var colors = require('../modules/colors');
var dice = require('../modules/dice');

//ADMIN
var admin = require('firebase-admin');
var serviceAccount = require('../keys/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'csgofeels-e3fc5',
    clientEmail: 'firebase-adminsdk-9ni9e@csgofeels-e3fc5.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDpcIPnnDf5BuIh\nuQ37OFT5BiAR7uPtPZvFIDqXlEHwtFKhaymh1fltK7t4Mp1zX4yDLs8Ylmh+ikAi\nE/J0BFdwjvVfDCz7S7Pu7RdUsVP5r+1e4hJjYUIFjMK2mDlep0OvZe5gFDNt6Dbz\nFZunqIl/f2EF2bvdMyeiHOFUmfwZzxnpUhIQXyEHfJC9RJJni6bKywa8A5EOUd5R\npsfi02Lgil6+0wt+TMUkjHwJUc+K3ywo1UNBv72jAyhR2gOiijNuvtYsjPJ1VHAg\nNr3cRdB9i0M4DEr7tdp+n2Q2D2EHpID1p8c7RS1TYxQH670dYlR5qyM41Vcn4Jb3\nQp2HDuVhAgMBAAECggEALgDjqbreR/fsi/dHU1UGX93uZ4JTzh7IShiAG3uW5Bvx\nNcjj1zYPFc3av8T/xOsVSovouaB4fsl5eo3CR81MOw0dO2ovmiVQ1BrKsIDSuv/J\n0FtOguG5jFTxUWEd2zKs0s3MZIhOm0/6NjzxpCCBWkwsv2WpkV3Bp3+4Az9mUGJg\nvZeaqfn9gUlv1elymJttoYyB+06olVbM4YNz5w57jXlbkoB2ATP0VvgB9Qgvwk97\n088wrmPDPXbnPmbz/mHo7E9zT7KwjPhjdi9lq08IrTVzPNq36g4ym7R6xVZpJTxP\n/OrEwJiehOcUf2jNqjuJPXJkey4A6xhqCs/K17B0fQKBgQD99qBE+kFscihVTOWK\nciFZXxnSwBWG65s3oxTfykcEHNzqRq+kaMN0Hbhyxz/0ASPGVO9CDSmTVX0jv2JA\nL97IhaJODU1OlmJFrUM2sDWH4VuwN66J/PN2Ef8IEwL2/cj6MFZVH56y1822PnIG\nzchdbBLzlrdP1P/fjOLnqIQTTQKBgQDrT8E2VQgOQqUJhDeERzfcoHCCi6IV7fDj\nKT0gbGzmvaxkwjDcgjGhU0DRdGnhFAReNJt7HHcDXSenQZjXu8sKsUlgIlc6TuOl\n3II4nEEfya2+iIvDpVPMvfPQYQHKSz1bKzSkRiZ0MGDs7u/myKXDrRDiv8QB11Qd\nW63yqYxoZQKBgEEbFbE5OsZzaZWclgftBFGmCLe3mI0zH2KfAz3v3E7Ym2XP4z1R\nwjGlYODD5chG9oXkxkV3nF3x/5fHe4ea/hEH+TjrPhNUiDL2nRGLEN4ZzuiZDbzA\nRSXSrT/Dp/Hr07cX5zoBVizhGBKNZawK2z/f8efSjoH/x+zmcFEVKW7NAoGAM/nt\n555opR27bpqx2JoSkL0vnOZS6x0ftE2LnvnUJDOJPMhYGpz3cXb+PkXEjV7qiBR+\ns3baIvgUpjErHZvxgW8fkgiD0/FQ/3XxnaeGCwt1QTzQAmsmU3cxv7ltt81exCCL\nBC4qmEeHYU511zhCxTIZJLzPAskZX1K83Xjt9rECgYEAjMPUE3cIspSqZjPR4t9A\nga8BT1mgHxsCLzTw1j9nwSKpRAry45PkgGMXuou7YDaNiIe+IgkSPqsde/pPJds6\nYPnRpe9ZsmQ8JhigMWR7hRqqCJcbenU4z+N2sPGqQDyVtwRPy6TvmmmTs9w/rkQJ\n+kdbVnF3Y/5b0Xk9r0vRZZc=\n-----END PRIVATE KEY-----\n'
  }),
  databaseURL: 'https://csgofeels-e3fc5.firebaseio.com'
});


var refreshToken; // Get refresh token from OAuth2 flow

// Get a reference to the database service
var database = admin.database();
