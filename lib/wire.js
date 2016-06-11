'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = wire;

var _redux = require('redux');

function wire(worker) {
  var intermediateState = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var shared = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

  var port = shared ? worker.port : worker;

  var syncedStore = (0, _redux.createStore)(function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? intermediateState : arguments[0];
    var action = arguments[1];

    switch (action.type) {
      case '@@workerRedux/SYNC':
        return action.payload.state;
      default:
        return state;
    }
  });

  port.onmessage = function (e) {
    syncedStore.dispatch(e.data);
  };

  function getMethodRunner(method) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return port.postMessage({
        type: 'runMethod',
        payload: { method: method, args: args }
      });
    };
  }

  var workerMethods = ['dispatch'];
  var wiredStore = new Proxy(syncedStore, {
    get: function get(target, name) {
      return workerMethods.includes(name) ? getMethodRunner(name) : target[name];
    }
  });

  wiredStore.dispatch({ type: '@@workerRedux/SYNC' });
  shared && worker.port.start();
  return wiredStore;
}