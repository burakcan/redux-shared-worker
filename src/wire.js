import { createStore } from 'redux';

export default function wire(worker, intermediateState = {}, shared = true) {
  const port = shared ? worker.port : worker;

  const syncedStore = createStore((state = intermediateState, action) => {
    switch (action.type) {
      case '@@workerRedux/SYNC':
        return action.payload.state;
      default:
        return state;
    }
  });

  port.onmessage = (e) => {
    syncedStore.dispatch(e.data);
  }

  function getMethodRunner(method) {
    return (...args) => port.postMessage({
      type: 'runMethod',
      payload: { method, args },
    });
  }

  const workerMethods = ['dispatch'];
  const wiredStore = new Proxy(syncedStore, {
    get: (target, name) =>
      workerMethods.includes(name) ?
      getMethodRunner(name) :
      target[name],
  });

  wiredStore.dispatch({ type: '@@workerRedux/SYNC' });
  shared && worker.port.start();
  return wiredStore;
}
