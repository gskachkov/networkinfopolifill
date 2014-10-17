/*
Networkinfo polifill to support network info type on browser that doesn't support nativly this feature 
*/
(function () {
  'use strict';

  /*We don't need of the polifill*/
  /*http://w3c.github.io/netinfo/#dfn-connection-types*/
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

  var pushEvents = function (connectionType) {
    var length = events.length;
    for (var i = 0; i < length; i++) {
      if (events[i]) {
        events[i] (connectionType);
      }
    }
  };

  if (navigator.connection === undefined) {
    var NetworkInformation = function () {
      this.type = navigator.onLine === false ? 'none' : 'unknown';
      this.addEventListener  = function (code, callback) {
        if (code === 'typechange') {
          events.push(callback);
        }
      };

      this.removeEventListener =  function (code, callback) {
        if (code === 'typechange') {
          var length = events.length;
          for (var i = 0; i < length; i++) {
            if (events[i] === callback) {
              events[i] = undefined;
            }
          }
        }
      };

      var calcConnectionType = function (_url, _timeout, _downloadSize) {
        var image = document.createElement('img');
        var self = this;
        image.onload = function () {
          var duration = Math.round((endTime - startTime) / 1000);
          var bitsLoaded = _downloadSize * 8;
          var speedBps = Math.round(bitsLoaded / duration);
          var speedKbps = (speedBps / 1024).toFixed(2);

          var newType = getTypeConnection(speedKbps);
          if (navigator.connection.type !== newType) {
            navigator.connection.type = newType;
            pushEvents(newType);
          }

          setTimeout(function () {
            calcConnectionType(_url, _timeout, _downloadSize);
          }, _timeout);
        };

        startTime = (new Date()).getTime();
        image.src =  _url + '?n=' + Math.random();
      };

      this.run = function (_params) {
        var params = _params || {};
        calcConnectionType(params.url || ulr, params.timeout || timeout, params.downloadSize || downloadSize);
      };
    };

    navigator.connection = new NetworkInformation();
  }
})();