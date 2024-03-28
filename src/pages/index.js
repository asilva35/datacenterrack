import Layout from '@/components/Layout';
import Metaheader from '@/components/Metaheader';
import React, { useState, useEffect } from 'react';
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
  useEffect(() => {
    if (window !== undefined) {
      window.scrollTo(0, 0);
    }
  }, []);
  return (
    <>
      <Metaheader />
      <Layout>
        <header>
          <div className={`${styles.section} section-01`}>
            <div className={`${styles.sectionInfo}`}>
              <p className={`${styles.subtitle} subtitle`}>
                World&apos;s leading datacenter supplier
              </p>
              <h1 className={`${styles.title}`}>
                <span className={`${styles.primaryText}`}>
                  <SplitText
                    LetterWrapper={({ letterIndex, children }) => (
                      <span className="title">{children}</span>
                    )}
                  >
                    Improving
                  </SplitText>
                </span>{' '}
                <SplitText
                  LetterWrapper={({ letterIndex, children }) => (
                    <span className="title">{children}</span>
                  )}
                >
                  your Datacenter
                </SplitText>
              </h1>
              <p className={`${styles.description} description`}>
                We are a company that specializes in improving your datacenter
                infrastructure.
              </p>
              <div className={`${styles.cta} cta`}>
                <Button onClick={() => {}}>Learn More</Button>
              </div>
            </div>
          </div>
        </header>
        <section>
          <div className={`${styles.section} section-02`}>
            <div className={`${styles.sectionInfo}`}>
              <h1 className={`${styles.title}`}>
                <span className={`${styles.primaryText}`}>
                  <SplitText
                    LetterWrapper={({ letterIndex, children }) => (
                      <span key={letterIndex} className="title">
                        {children}
                      </span>
                    )}
                  >
                    We&apos;ll Help you
                  </SplitText>
                </span>
                <SplitText
                  LetterWrapper={({ letterIndex, children }) => (
                    <span key={letterIndex} className="title">
                      {children}
                    </span>
                  )}
                >
                  Figure out you need
                </SplitText>
              </h1>
              <p className={`${styles.description} description`}>
                Get it to you fast, and we&apos;ll stand behind it.
              </p>
            </div>
          </div>
        </section>
        <section>
          <div
            className={`${styles.section} ${styles.contentRight} section-03`}
          >
            <div className={`${styles.sectionInfo}`}>
              <h1 className={`${styles.title}`}>
                <span className={`${styles.primaryText}`}>
                  <SplitText
                    LetterWrapper={({ letterIndex, children }) => (
                      <span key={letterIndex} className="title">
                        {children}
                      </span>
                    )}
                  >
                    3 We&apos;ll Help you
                  </SplitText>
                </span>
                <SplitText
                  LetterWrapper={({ letterIndex, children }) => (
                    <span key={letterIndex} className="title">
                      {children}
                    </span>
                  )}
                >
                  Figure out you need
                </SplitText>
              </h1>
              <p className={`${styles.description} description`}>
                Get it to you fast, and we&apos;ll stand behind it.
              </p>
            </div>
          </div>
        </section>
      </Layout>
      <Model3d debug={false} />
      <div className="empty"></div>
    </>
  );
}
