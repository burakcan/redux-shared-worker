'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = wire;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function wire(store) {
  var shared = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  function handleIncomingMessage(event) {
    var _event$data = event.data;
    var type = _event$data.type;
    var _event$data$payload = _event$data.payload;
    var method = _event$data$payload.method;
    var args = _event$data$payload.args;

    if (type === 'runMethod') {
      store[method].apply(store, _toConsumableArray(args));
    }
  }

  function createSyncAction() {
    return {
      type: '@@workerRedux/SYNC',
      payload: {
        state: store.getState()
      }
    };
  }

  if (shared) {
    onconnect = function onconnect(e) {
      var port = e.ports[0];
      port.onmessage = handleIncomingMessage;

      store.subscribe(function () {
        return port.postMessage(createSyncAction());
      });
    };
  } else {
    onmessage = handleIncomingMessage;

    store.subscribe(function () {
      return postMessage(createSyncAction());
    });
  }

  return store;
}