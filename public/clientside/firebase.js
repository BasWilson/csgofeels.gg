var config = {
  apiKey: "AIzaSyDkruw1uL6iYWqZSPViL9Yn2SIvl8-aeEs",
  authDomain: "csgofeels-e3fc5.firebaseapp.com",
  databaseURL: "https://csgofeels-e3fc5.firebaseio.com",
  projectId: "csgofeels-e3fc5",
  storageBucket: "csgofeels-e3fc5.appspot.com",
  messagingSenderId: "164429330096"
};
firebase.initializeApp(config);

var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().useDeviceLanguage();

var usernameCookie = Cookies.get('username');
var photoCookie = Cookies.get('photo');

//Check if user is signed in
checkIfSignedIn();

function loginWithGoogle() {
  firebase.auth().signInWithPopup(provider).then(function(result) {
  var token = result.credential.accessToken;
  var user = result.user;

  //Create a cookie with the username
  Cookies.set('username', user.displayName);
  Cookies.set('photo', user.photoURL);

  checkIfSignedIn();

}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});
}

function checkIfSignedIn() {

    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      $( ".google-button" ).remove();
      getBalance(balance);
      setUsername(user);
    } else {
      // No user is signed in.
    }
  });
}

//Sign out of the Google account
function signout() {

  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    checkIfSignedIn();
  }).catch(function(error) {
    // An error happened.
  });
}

$("#GoogleLogin").click(function() {
  loginWithGoogle()
});

//Get balance
function getBalance(balance, userId, experience) {

  var balanceCookie = Cookies.get('balance');
  var experienceCookie = Cookies.get('experience');
  $('#balance').text(balanceCookie+" COINS");

  var user = firebase.auth().currentUser;
  userId = user.uid;
  firebase.database().ref('/users/' + userId + '/properties/').once('value').then(function(snapshot) {
    balance = (snapshot.val() && snapshot.val().balance);
    experience = (snapshot.val() && snapshot.val().experience);
    console.log(balance);
    console.log(experience);
	  if (balance == null) {
		  balance = 0.00;
	    $('#balance').text("0.00 COINS");
	  } else {
		$('#balance').text(balance+" COINS");
	  }

    if (experience == null) {
      experience = 0.00;
    } else {
      //visually set experience
    }
    Cookies.set('balance', balance);
    Cookies.set('experience', experience);

  });
}

function saveTradelink(tradelink) {
  var user = firebase.auth().currentUser;

  firebase.database().ref('publicusers/' + user.uid).update({
    tradelink: tradelink
  });
}

function setUsername(user, username) {
  username = Cookies.get('username');

  firebase.database().ref('publicusers/' + user.uid).update({
    username: username
  });
}

function getUsername(username) {
  username = Cookies.get('username');
}
