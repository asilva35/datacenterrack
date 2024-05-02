import React, { createContext, useContext, useReducer } from 'react';

const ConfiguratorContext = createContext(null);

const useConfiguratorContext = () => useContext(ConfiguratorContext);

let initialState = {
  theme: 'dark',
  navStyle: '01',
  showTopBar: false,
  is360view: false,
  show3DModel: false,
  showDebug: false,
};

let reducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME': {
      return {
        ...state,
        theme: action.theme,
      };
    }
    case 'SET_NAV_STYLE': {
      return {
        ...state,
        navStyle: action.navStyle,
      };
    }
    case 'SET_360_VIEW': {
      return {
        ...state,
        is360view: action.is360view,
      };
    }
    case 'SHOW_TOP_BAR': {
      return {
        ...state,
        showTopBar: action.showTopBar,
      };
    }
    case 'SHOW_3D_MODEL': {
      return {
        ...state,
        show3DModel: action.show3DModel,
      };
    }
    case 'SHOW_DEBUG':
      {
        return {
          ...state,
          showDebug: action.showDebug,
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
