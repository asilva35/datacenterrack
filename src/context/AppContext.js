import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext(null);

const useAppContext = () => useContext(AppContext);

let initialState = {
  theme: 'dark',
  navStyle: '01',
  showTopBar: false,
  is360view: false,
  show3DModel: false,
  showDebug: false,
  showProductInfo: false,
  showProductPartInfo: false,
  loading: {
    progress: 0,
    text: 'Loading Progress: 0%',
  },
  currentInfoPoint: null,
  countInfoPointsClicked: 0,
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
    case 'SHOW_PRODUCT_INFO': {
      return {
        ...state,
        showProductInfo: action.showProductInfo,
      };
    }
    case 'SHOW_PRODUCT_PART_INFO': {
      return {
        ...state,
        showProductPartInfo: action.showProductPartInfo,
      };
    }
    case 'SHOW_DEBUG': {
      return {
        ...state,
        showDebug: action.showDebug,
      };
    }
    case 'SET_LOADING': {
      return {
        ...state,
        loading: {
          progress: action.loading.progress,
          text: action.loading.text,
        },
      };
    }
    case 'ON_CLICK_INFO_POINT':
      {
        return {
          ...state,
          currentInfoPoint: action.currentInfoPoint,
          countInfoPointsClicked: state.countInfoPointsClicked + 1,
        };
      }
      throw Error('Unknown action: ' + action.type);
  }
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider, useAppContext };
