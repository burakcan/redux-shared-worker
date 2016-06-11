import { createStore } from 'redux';
import wire from '../../lib/wire.worker.js';

wire(
  createStore((state = { value: 0 }, action) => {
    switch (action.type) {
      case 'RANDOMIZE':
        let newValue = 0;
        for (var i = 0; i < 100000; i++) {
          newValue = Math.random();
        }
        return { value: newValue };
      default:
        return state;
    }
  }),
  false
);
