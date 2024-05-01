import React, { createContext, useContext, useReducer } from 'react';

const ConfiguratorContext = createContext(null);

const useConfiguratorContext = () => useContext(ConfiguratorContext);

let initialState = {
  is360view: false,
};

let reducer = (state, action) => {
  switch (action.type) {
    case 'SET_360_VIEW':
      {
        return {
          ...state,
          is360view: action.is360view,
        };
      }
      throw Error('Unknown action: ' + action.type);
  }
};

const ConfiguratorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return (
    <ConfiguratorContext.Provider value={value}>
      {children}
    </ConfiguratorContext.Provider>
  );
};

export { ConfiguratorContext, ConfiguratorProvider, useConfiguratorContext };
