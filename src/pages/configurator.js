import Layout from '@/components/Layout';
import Metaheader from '@/components/Metaheader';
import React, { useState, useEffect, useContext } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import configJson from '@/config/configurator/config.json';
import animationsJson from '@/config/configurator/animations.json';
import TextRotated from '@/components/configurator/TextRotated';
import HeaderInfo from '@/components/configurator/HeaderInfo';
import FooterMenu from '@/components/configurator/FooterMenu';
import Thumbnails from '@/components/configurator/Thumbnails';
import AddonsMenu from '@/components/AddonsMenu';
import Hide360View from '@/components/configurator/Hide360View';
import BG from '@/components/configurator/BG';

import { AppContext } from '@/context/AppContext';
import ProductInfo from '@/components/configurator/ProductInfo';
import LoadingScreen from '@/components/configurator/LoadingScreen';
import InfoPoints from '@/components/configurator/InfoPoints';

const Configurator3d = dynamic(
  () => import('@/components/Models3D/Configurator3d'),
  {
    ssr: false,
  }
);

export default function Configurator() {
  const [config, setConfig] = useState(configJson);
  const [animations, setAnimations] = useState(animationsJson);
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
    if (state.show3DModel) {
      dispatch({
        type: 'SHOW_TOP_BAR',
        showTopBar: true,
      });
    }
  }, [state.show3DModel]);
  return (
    <>
      <Metaheader />
      <LoadingScreen />
      <Hide360View />
      <Layout>
        <TextRotated />
        <HeaderInfo />
        <AddonsMenu />
        <Thumbnails />
        <ProductInfo />
        <InfoPoints config={config} />
        <FooterMenu />
      </Layout>
      <Configurator3d
        debug={showDebug}
        config={config}
        animations={animations}
      />
      <BG />
    </>
  );
}
