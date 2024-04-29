import Layout from '@/components/Layout';
import Metaheader from '@/components/Metaheader';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import configJson from '@/config/configurator/config.json';
import TextRotated from '@/components/configurator/TextRotated';
import HeaderInfo from '@/components/configurator/HeaderInfo';

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
  const [config, setConfig] = useState(configJson);
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
  return (
    <>
      <Metaheader />
      <Layout showTopBar={showTopBar} theme="light" navStyle="02">
        <TextRotated />
        <HeaderInfo />
      </Layout>
      <Configurator3d debug={showDebug} show={show3dModel} config={config} />
      <div className="empty"></div>
    </>
  );
}
