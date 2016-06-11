import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import SharedStore from 'shared-worker!./configureSharedStore';
import NonSharedStore from 'worker!./configureNonSharedStore';
import nonWorkerStore from './configureNonWorkerStore';
import wire from '../../lib/wire';

const sharedStore = wire(new SharedStore, { value: null });
const nonSharedStore = wire(new NonSharedStore, { value: 0 }, false);

const SharedDemo = connect(
  state => {
    return {
      value: state.value,
    };
  }
)(
  props => {
    return (
      <div>
        <h5>SharedWorker (open another tab)</h5>
        <input
          type="text"
          placeholder="type something"
          onChange={ e => {
            sharedStore.dispatch({
              type: 'SET_VALUE',
              payload: e.target.value,
            });
          }}
          value={ props.value }
        />
      </div>
    );
  }
);

const NonSharedDemo = connect(
  state => {
    return {
      value: state.value,
    };
  }
)(
  props => {
    return (
      <div>
        <h5>WebWorker</h5>
        value: { props.value } <br />
        <button
          onClick={() => {
            nonSharedStore.dispatch({
              type: 'RANDOMIZE',
            })
          }}
          style={{ marginTop: 10 }}
        >
          GENERATE RANDOM
        </button>
      </div>
    );
  }
);

const NonWorkerDemo = connect(
  state => {
    return {
      value: state.value,
    };
  }
)(
  props => {
    return (
      <div>
        <h5>Normal reducer (no Worker)</h5>
        value: { props.value } <br />
        <button
          onClick={() => {
            nonWorkerStore.dispatch({
              type: 'RANDOMIZE',
            })
          }}
          style={{ marginTop: 10 }}
        >
          GENERATE RANDOM
        </button>
      </div>
    );
  }
);

function App() {
  return (
    <div
      style={{
        display: 'flex',
        alignContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <div style={{ paddingTop: 20, paddingBottom: 20, borderBottom: '1px solid #d0d0d0' }}>
        <Provider store={ nonWorkerStore }>
          <NonWorkerDemo />
        </Provider>
      </div>
      <div style={{ paddingTop: 20, paddingBottom: 20, borderBottom: '1px solid #d0d0d0' }}>
        <Provider store={ sharedStore }>
          <SharedDemo />
        </Provider>
      </div>
      <div style={{ paddingTop: 20, paddingBottom: 20, borderBottom: '1px solid #d0d0d0' }}>
        <Provider store={ nonSharedStore }>
          <NonSharedDemo />
        </Provider>
      </div>
    </div>
  );
}

render(
  <App />,
  document.getElementById('Root')
);
