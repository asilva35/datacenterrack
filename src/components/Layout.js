import React, { useEffect, useContext } from 'react';
import TopBar from '@/components/TopBar';
import styles from '@/styles/Layout.module.css';
import { ConfiguratorContext } from '@/context/ConfiguratorContext';

export default function Layout(props) {
  const { children } = props;
  const { state, dispatch } = useContext(ConfiguratorContext);
  return (
    <div
      className={`${styles.LayoutWrapper} ${styles[state.theme]} ${
        state.is360view ? styles.pointerEventsNone : ''
      }`}
    >
      <TopBar />
      <div className={`${styles.LayoutBody}`}>{children}</div>
    </div>
  );
}
