import Layout from '@/components/Layout';
import Metaheader from '@/components/Metaheader';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import configJson from '@/config/configurator/config.json';

import styles from '@/styles/Home.module.css';

import { Button } from '@nextui-org/react';

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
      <Layout showTopBar={showTopBar}>
        {/* <header>
          <div
            id="header"
            className={`${styles.section} ${styles.section01} section section-01`}
          ></div>
        </header> */}
      </Layout>
      <Configurator3d debug={showDebug} show={show3dModel} config={config} />
      <div className="empty"></div>
    </>
  );
}
