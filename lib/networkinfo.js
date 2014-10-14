/*
Networkinfo polifill to support network info type on browser that doesn't support nativly this feature 
*/
(function () {
  'use strict';

  /*We don't need of the polifill*/
  if (navigator.connection || navigator.mozConnection || navigator.webkitConnection) return; 
  var events = [];
  var ulr = 'http://www.google.com/images/phd/px.gif';
  var startTime, endTime;
  var downloadSize = 4000;
  var timeout = 5000;

  var getTypeConnection = function (speedKbps) {
    if (speedKbps >= 100000) {
      return 'ethernet';
    } else if (speedKbps < 100000 && speedKbps > 16000) {
      return 'wifi';
    } else if (speedKbps <= 16000) {
      return 'cellular';
    }
  };

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

  var pushEvents = function (connectionType) {
    var length = events.length;
    for (var i = 0; i < length; i++) {
      if (events[i]) {
        events[i] (connectionType);
      }
    }
  };

  var calcConnectionType = function () {
    var image = document.createElement('img');
    var self = this;
    image.onload = function () {
      var duration = Math.round((endTime - startTime) / 1000);
      var bitsLoaded = downloadSize * 8;
      var speedBps = Math.round(bitsLoaded / duration);
      var speedKbps = (speedBps / 1024).toFixed(2);

      var oldType = navigator.connection.type;
      var newType = getTypeConnection(speedKbps);
      if (oldType !== newType) {
        navigator.connection.type = newType;
        pushEvents(navigator.connection.type);
      }

      setTimeout(function () {
        calcConnectionType.call(self);
      }, timeout);
    };

    startTime = (new Date()).getTime();
    image.src =  url + '?n=' + Math.random();
  };

  window.connection = {};

  if (window.navigator.connection === undefined) {
    window.navigator.connection = {
      type               : 'unknown',
      addEventListener   : addEventListener,
      removeEventListener: removeEventListener
    };
  }

  calcConnectionType();
})();