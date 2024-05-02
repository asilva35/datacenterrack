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

import { AppContext } from '@/context/AppContext';

const Configurator3d = dynamic(
  () => import('@/components/Models3D/Configurator3d'),
  {
    ssr: false,
  }
);

export default function Configurator() {
  const [config, setConfig] = useState(configJson);
  const [showDebug, setShowDebug] = useState(false);
  const { state, dispatch } = useContext(AppContext);

  const router = useRouter();
  useEffect(() => {
    if (router.query.debug) {
      setShowDebug(true);
    }
  }, [router.query.debug]);
  useEffect(() => {
    if (window !== undefined) {
      window.scrollTo(0, 0);
      dispatch({
        type: 'SET_THEME',
        theme: 'light',
      });
      dispatch({
        type: 'SET_NAV_STYLE',
        navStyle: '02',
      });
    }
  }, []);
  useEffect(() => {
    let timer = setTimeout(() => {
      dispatch({
        type: 'SHOW_3D_MODEL',
        show3DModel: true,
      });
      dispatch({
        type: 'SHOW_TOP_BAR',
        showTopBar: true,
      });
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <>
      <Metaheader />
      <Hide360View />
      <Layout>
        <TextRotated />
        <HeaderInfo />
        <AddonsMenu />
        <Thumbnails />
        <FooterMenu />
      </Layout>
      <Configurator3d debug={showDebug} config={config} />
      <div className="empty"></div>
    </>
  );
}
