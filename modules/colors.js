module.exports = {
  joinColorsGameMode: function (gameData, socket) {
    socket.join('ColorsRoom');
    console.log('Colors room joined');
  },
  
};
