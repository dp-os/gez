'use strict';

/* eslint-disable */
function init(src, curName, remoteName, varName) {
  if (window[varName]) {
    return window[varName];
  }
  var queueKey = varName + '_queue';
  var isFirst = !window[queueKey];
  if (isFirst) {
    window[queueKey] = [];
  }
  var queue = window[queueKey];
  function excute(name, val) {
    queue.forEach(function (item) {
      item[name](val);
    });
    window[queueKey] = []
  }
  return new Promise(function (resolve, reject) {
    queue.push({
      resolve: resolve,
      reject: reject
    });
    if (isFirst) {
      if (!src) {
        var err = new Error(curName + " does not declare that " + remoteName + " is a remote dependency");
        excute("reject", err);
        return;
      }
      var script = document.createElement("script");
      script.src = src;
      script.onload = function onload() {
        var proxy = {
          get: function (request) {
            return window[varName].get(request);
          },
          init: function (arg) {
            try {
              return window[varName].init(arg);
            } catch (e) {
              console.log('remote container already initialized');
            }
          }
        };
        excute("resolve", proxy);
      };
      script.onerror = function onerror() {
        document.head.removeChild(script);
        var err = new Error("Load " + script.src + " failed");
        excute("reject", err);
      };
      document.head.appendChild(script);
    }
  });
}