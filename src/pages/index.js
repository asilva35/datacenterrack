import Layout from '@/components/Layout';
import Metaheader from '@/components/Metaheader';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '@/styles/Home.module.css';
import { SplitText } from '@rigo-m/react-split-text';

import { Button } from '@nextui-org/react';
import Image from 'next/image';

const Model3d = dynamic(() => import('@/components/Model3d'), {
  ssr: false,
});

export default function Home() {
  const [model3DLoaded, setModel3DLoaded] = useState(false);
  return (
    <>
      <Metaheader />
      <Layout>
        <header>
          <div className={`${styles.section}`}>
            <p className={`${styles.subtitle}`}>
              World&apos;s leading datacenter supplier
            </p>
            <h1 className={`${styles.title}`}>
              <span className={`${styles.primaryText}`}>
                <SplitText>Improving</SplitText>
              </span>{' '}
              <SplitText>your Datacenter</SplitText>
            </h1>
            <p className={`${styles.description}`}>
              We are a company that specializes in improving your datacenter
              infrastructure.
            </p>
            <div className={`${styles.cta}`}>
              <Button onClick={() => {}}>Learn More</Button>
            </div>
          </div>
        </header>
        <section>
          <div className={`${styles.section}`}>
            <h1 className={`${styles.title}`}>Improving your Datacenter</h1>
            <p className={`${styles.description}`}>
              We are a company that specializes in improving your datacenter
              infrastructure.
            </p>
          </div>
        </section>
      </Layout>
      <Model3d debug={false} />
    </>
  );
}
