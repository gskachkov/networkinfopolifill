/*
Networkinfo polifill to support network info type on browser that doesn't support nativly this feature 
*/
( function () {
  'use strict';

  var events = [];
  var ulr = 'http://www.google.com/images/phd/px.gif';
  var startTime, endTime;
  var downloadSize = 200000;


  var calcConnectionType = function () {
    var image = document.createElement('img'); // new Image(1, 1);
    image.onload = function () {
      var duration = Math.round((endTime - startTime) / 1000);
      var bitsLoaded = downloadSize * 8;
      var speedBps = Math.round(bitsLoaded / duration);
      var speedKbps = (speedBps / 1024).toFixed(2);
      var speedMbps = (speedKbps / 1024).toFixed(2);

      console.log("Your connection speed is: \n" + 
           speedBps + " bps\n"   + 
           speedKbps + " kbps\n" + 
           speedMbps + " Mbps\n" );
    };
    
    startTime = (new Date()).getTime();
    image.src =  url + '?n' + Math.random();
    //image.src = imageAddr;
  };

  var connectionType = calcConnectionType();
  var addEventListener = function (code, callback) {
    if (code === 'typechange') {
      events.push(callback);
    }
  };

  var removeEventListener = function (code, callback) {
    if (code === 'typechange') {
      var length = events.length;
      for (var i = length - 1; i >= 0; i--) {
        if (events[i] === callback) {
          events[i] = undefined;
        }
      }
    }
  };

  if (window.navigator !== undefined && window.navigator.connection !== undefined && window.navigator.connection.type !== undefined) {
      /*We don't need of the polifill*/
    return;
  }

  if (window.navigator === undefined) {
    window.connection = {};
  }

  if (window.navigator.connection === undefined) {
    window.navigator.connection = {
      type               : connectionType,
      addEventListener   : addEventListener,
      removeEventListener: removeEventListener
    };
  }
})();




/*var download = new Image();
download.onload = function () {
   ;
    showResults();
}
startTime = (new Date()).getTime();
download.src = imageAddr;

function showResults() {
    var duration = Math.round((endTime - startTime) / 1000);
    var bitsLoaded = downloadSize * 8;
    var speedBps = Math.round(bitsLoaded / duration);
    var speedKbps = (speedBps / 1024).toFixed(2);
    var speedMbps = (speedKbps / 1024).toFixed(2);
    alert();
}*/