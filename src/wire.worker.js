export default function wire(store, shared = true) {
  function handleIncomingMessage(event) {
    const { type, payload: { method, args } } = event.data;
    if (type === 'runMethod') {
      store[method](...args);
    }
  }

  function createSyncAction() {
    return {
      type: '@@workerRedux/SYNC',
      payload: {
        state: store.getState(),
      },
    };
  }

  if (shared) {
    onconnect = e => {
      var port = e.ports[0];
      port.onmessage = handleIncomingMessage;

      store.subscribe(
        () => port.postMessage(createSyncAction())
      );
    }
  } else {
    onmessage = handleIncomingMessage;

    store.subscribe(
      () => postMessage(createSyncAction())
    );
  }

  return store;
}
