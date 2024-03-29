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
        <div className={`${styles.home} ${styles.intro}`}>
          <header>
            <div className={`${styles.section} ${styles.section01} section-01`}>
              <div className={`${styles.sectionInfo}`}>
                <div className={`${styles.sectionInfoAbsolute}`}>
                  <p className={`${styles.subtitle} subtitle`}>
                    World&apos;s leading datacenter supplier
                  </p>
                  <h1 className={`${styles.title}`}>
                    <span className={`${styles.primaryText}`}>
                      <SplitText
                        LetterWrapper={({ letterIndex, children }) => (
                          <span
                            className={`title ${styles.letterTitle} ${
                              styles['letterTitle-' + letterIndex]
                            }`}
                          >
                            {children}
                          </span>
                        )}
                      >
                        Improving
                      </SplitText>
                    </span>{' '}
                    <span className={`${styles.line02}`}>your</span>
                    <span className={`${styles.line03}`}>Datacenter</span>
                  </h1>
                  <p className={`${styles.description} description`}>
                    We are a company that specializes in improving your
                    datacenter infrastructure.
                  </p>
                  <div className={`${styles.cta} cta`}>
                    <Button onClick={() => {}}>Learn More</Button>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <section>
            <div id="partners" className={`${styles.section} section-02`}>
              <div className={`${styles.sectionInfo}`}>
                <p className={`${styles.subtitle} subtitle`}>
                  Why Partner with Us?
                </p>
                <h1 className={`${styles.title}`}>
                  <span className={`${styles.primaryText}`}>
                    <SplitText
                      LetterWrapper={({ letterIndex, children }) => (
                        <span key={letterIndex} className="title">
                          {children}
                        </span>
                      )}
                    >
                      Experience, Expertise, Efficiency
                    </SplitText>
                  </span>
                </h1>
                <p className={`${styles.description} description`}>
                  We deliver comprehensive data center solutions, from
                  cutting-edge technologies to unparalleled customer service.
                </p>
                <div className={`${styles.cta} cta`}>
                  <Button onClick={() => {}}>Learn More</Button>
                </div>
              </div>
            </div>
          </section>
          <section>
            <div
              className={`${styles.section} ${styles.contentRight} section-03`}
            >
              <div className={`${styles.sectionInfo}`}>
                <p className={`${styles.subtitle} subtitle`}>Our Services</p>
                <h1 className={`${styles.title} ${styles.medium}`}>
                  <span className={`${styles.primaryText}`}>
                    <SplitText
                      LetterWrapper={({ letterIndex, children }) => (
                        <span key={letterIndex} className="title">
                          {children}
                        </span>
                      )}
                    >
                      Building the Future
                    </SplitText>
                  </span>
                  <SplitText
                    LetterWrapper={({ letterIndex, children }) => (
                      <span key={letterIndex} className="title">
                        {children}
                      </span>
                    )}
                  >
                    of Data Centers
                  </SplitText>
                </h1>
                <p className={`${styles.description} description`}>
                  Explore our comprehensive suite of services, including design,
                  construction, maintenance, and colocation solutions.
                </p>
                <div className={`${styles.cta} cta`}>
                  <Button onClick={() => {}}>Learn More</Button>
                </div>
              </div>
            </div>
          </section>
          <section>
            <div
              className={`${styles.section} ${styles.contentRight} section-04`}
            >
              <div className={`${styles.sectionInfo}`}>
                <p className={`${styles.subtitle} subtitle`}>
                  Let&apos;s Get Connected
                </p>
                <h1 className={`${styles.title} ${styles.medium}`}>
                  <span className={`${styles.primaryText}`}>
                    <SplitText
                      LetterWrapper={({ letterIndex, children }) => (
                        <span key={letterIndex} className="title">
                          {children}
                        </span>
                      )}
                    >
                      We&apos;re Here to Help
                    </SplitText>
                  </span>
                </h1>
                <p className={`${styles.description} description`}>
                  Have questions or ready to discuss your data center needs?
                  Contact us today!
                </p>
                <div className={`${styles.cta} cta`}>
                  <Button onClick={() => {}}>Email us</Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
      <Model3d debug={false} />
      <div className={`${styles.mainBg}`}>
        <div className={`${styles.ellipse}`}></div>
      </div>
      <div className="empty"></div>
    </>
  );
}
