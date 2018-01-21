/////////////////////////////////
//SETTINGS PAGE
/////////////////////////////////

//POPUPS
var popups = Cookies.get('dicepopups');
var tradelink = Cookies.get('tradelink');


if (tradelink == undefined) {

} else {
  document.getElementById('tradelinkField').value = tradelink;
}
if (popups == 1) {
  $('#disable-popup').prop('checked', true);
} else {
  $('#disable-popup').prop('checked', false);
}

$("#savesettings").click(function(text) {
  //Set popup cookie
    if ($('#disable-popup').is(":checked"))
  {
    var popups = 1;
    Cookies.set('dicepopups', popups, { expires: 7 });
  } else {
    var popups = 0;
    Cookies.set('dicepopups', popups, { expires: 7 });
  }
  var tradelink = document.getElementById('tradelinkField').value;
  Cookies.set('tradelink', tradelink);
  saveTradelink(tradelink);
  text = "Settings have been saved";
  showGenericPopup(text);
});

//NEXT ITEM TODO
