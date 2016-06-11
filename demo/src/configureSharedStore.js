import { createStore } from 'redux';
import wire from '../../lib/wire.worker.js';

wire(
  createStore((state = { value: null }, action) => {
    switch (action.type) {
      case 'SET_VALUE':
        return { value: action.payload };
      default:
        return state;
    }
  })
);
