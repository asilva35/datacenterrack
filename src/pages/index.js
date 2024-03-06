import Layout from '@/components/Layout';
import Metaheader from '@/components/Metaheader';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const Model3d = dynamic(() => import('@/components/Model3d'), {
  ssr: false,
});

export default function Home() {
  const [model3DLoaded, setModel3DLoaded] = useState(false);
  return (
    <>
      <Metaheader />
      <Layout></Layout>
      <Model3d debug={true} />
    </>
  );
}
