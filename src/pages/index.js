import Layout from '@/components/Layout';
import Metaheader from '@/components/Metaheader';
import React, { useState, useEffect, useContext } from 'react';
import dynamic from 'next/dynamic';
import styles from '@/styles/Home.module.css';

import { Button } from '@nextui-org/react';
import { useRouter } from 'next/router';

import { AppContext } from '@/context/AppContext';

const Model3d = dynamic(() => import('@/components/Models3D/Model3d'), {
  ssr: false,
});

export default function Home() {
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
        theme: 'dark',
      });
      dispatch({
        type: 'SET_NAV_STYLE',
        navStyle: '01',
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
    }, 7000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <>
      <Metaheader />
      <Layout>
        <div className={`${styles.home} ${styles.intro}`}>
          <header>
            <div
              id="header"
              className={`${styles.section} ${styles.section01} section section-01`}
            >
              <div className={`${styles.sectionInfo} sectionInfo`}>
                <div className={`${styles.sectionInfoAbsolute}`}>
                  <p className={`${styles.subtitle} subtitle`}>
                    World&apos;s leading datacenter supplier
                  </p>
                  <h1 className={`${styles.title}`}>
                    <span className={`${styles.primaryText}`}>
                      <span
                        className={`title ${styles.letterTitle} ${styles.letterTitle01}`}
                      >
                        I
                      </span>
                      <span
                        className={`title ${styles.letterTitle} ${styles.letterTitle02}`}
                      >
                        m
                      </span>
                      <span
                        className={`title ${styles.letterTitle} ${styles.letterTitle03}`}
                      >
                        p
                      </span>
                      <span
                        className={`title ${styles.letterTitle} ${styles.letterTitle04}`}
                      >
                        r
                      </span>
                      <span
                        className={`title ${styles.letterTitle} ${styles.letterTitle05}`}
                      >
                        o
                      </span>
                      <span
                        className={`title ${styles.letterTitle} ${styles.letterTitle06}`}
                      >
                        v
                      </span>
                      <span
                        className={`title ${styles.letterTitle} ${styles.letterTitle07}`}
                      >
                        i
                      </span>
                      <span
                        className={`title ${styles.letterTitle} ${styles.letterTitle08}`}
                      >
                        n
                      </span>
                      <span
                        className={`title ${styles.letterTitle} ${styles.letterTitle09}`}
                      >
                        g
                      </span>
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
            <div
              id="partners"
              className={`${styles.section} section section-02`}
            >
              <div className={`${styles.sectionInfo} sectionInfo`}>
                <p className={`${styles.subtitle} subtitle`}>
                  Why Partner with Us?
                </p>
                <h1 className={`${styles.title} ${styles.medium}`}>
                  <span className={`${styles.primaryText}`}>
                    Experience, Expertise, Efficiency
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
              id="services"
              className={`${styles.section} ${styles.contentRight} section section-03`}
            >
              <div className={`${styles.sectionInfo} sectionInfo`}>
                <p className={`${styles.subtitle} subtitle`}>Our Services</p>
                <h1 className={`${styles.title} ${styles.medium}`}>
                  <span className={`${styles.primaryText}`}>
                    Building the Future
                  </span>
                  <span>of Data Centers</span>
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
              id="contact"
              className={`${styles.section} ${styles.contentRight} section section-04`}
            >
              <div className={`${styles.sectionInfo} sectionInfo`}>
                <p className={`${styles.subtitle} subtitle`}>
                  Let&apos;s Get Connected
                </p>
                <h1 className={`${styles.title} ${styles.medium}`}>
                  <span className={`${styles.primaryText}`}>
                    We&apos;re Here to Help
                  </span>
                </h1>
                <p className={`${styles.description} description`}>
                  Have questions or ready to discuss your data center needs?
                  Contact us today!
                </p>
                <div className={`${styles.cta} cta`}>
                  <Button
                    onClick={() => {
                      location.href = 'mailto:ventas@example.com';
                    }}
                  >
                    Email us
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
      <Model3d debug={showDebug} />
      <div className={`${styles.mainBg}`}>
        <div className={`${styles.ellipse}`}></div>
      </div>
      <div className="empty"></div>
    </>
  );
}
