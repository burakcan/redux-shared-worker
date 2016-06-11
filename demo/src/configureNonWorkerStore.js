import { createStore } from 'redux';

export default createStore((state = { value: 0 }, action) => {
  switch (action.type) {
    case 'RANDOMIZE':
      let newValue = 0;
      for (var i = 0; i < 100000000; i++) {
        newValue = Math.random();
      }
      return { value: newValue };
    default:
      return state;
  }
});
