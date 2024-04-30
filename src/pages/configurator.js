import Layout from '@/components/Layout';
import Metaheader from '@/components/Metaheader';
import React, { useState, useEffect, useContext } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import configJson from '@/config/configurator/config.json';
import TextRotated from '@/components/configurator/TextRotated';
import HeaderInfo from '@/components/configurator/HeaderInfo';
import FooterMenu from '@/components/configurator/FooterMenu';
import Thumbnails from '@/components/configurator/Thumbnails';
import AddonsMenu from '@/components/AddonsMenu';
import Hide360View from '@/components/configurator/Hide360View';

//import { configuratorReducer } from '@/reducers/configuratorReducer';

import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'IS_360_VIEW':
      {
        return {
          ...state,
          is360view: action.is360view,
        };
      }
      throw Error('Unknown action: ' + action.type);
  }
}

const Configurator3d = dynamic(
  () => import('@/components/Models3D/Configurator3d'),
  {
    ssr: false,
  }
);

export default function Configurator() {
  const [show3dModel, setShow3dModel] = useState(false);
  const [showTopBar, setShowTopBar] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [is360view, setIs360view] = useState(false);
  const [config, setConfig] = useState(configJson);
  const [state, dispatch] = useReducer(reducer, {
    is360view: false,
  });
  const router = useRouter();
  useEffect(() => {
    if (router.query.debug) {
      setShowDebug(true);
    }
  }, [router.query.debug]);
  useEffect(() => {
    if (window !== undefined) {
      window.scrollTo(0, 0);
    }
  }, []);
  useEffect(() => {
    let timer = setTimeout(() => {
      setShow3dModel(true);
      setShowTopBar(true);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const onClick360 = () => {
    setIs360view(true);
    dispatch({
      type: 'IS_360_VIEW',
      is360view: true,
    });
  };

  const onClickHide360 = () => {
    setIs360view(false);
    dispatch({
      type: 'IS_360_VIEW',
      is360view: false,
    });
  };
  return (
    <>
      <Metaheader />
      <Hide360View onClickHide360={onClickHide360} is360view={is360view} />
      <Layout
        showTopBar={showTopBar}
        is360view={is360view}
        state={state}
        theme="light"
        navStyle="02"
      >
        <TextRotated is360view={is360view} />
        <HeaderInfo is360view={is360view} />
        <AddonsMenu onClick360={onClick360} />
        <Thumbnails />
        <FooterMenu />
      </Layout>
      <Configurator3d
        debug={showDebug}
        show={show3dModel}
        config={config}
        is360view={is360view}
      />
      <div className="empty"></div>
    </>
  );
}
