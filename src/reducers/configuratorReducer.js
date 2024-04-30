import { createContext, useReducer } from 'react';

export const configuratorReducer = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'IS_360_VIEW':
      {
        return {
          is360View: action.is360View,
        };
      }
      throw Error('Unknown action: ' + action.type);
  }
}
