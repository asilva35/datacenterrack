import React, { useEffect, useContext } from 'react';
import TopBar from '@/components/TopBar';
import styles from '@/styles/Layout.module.css';
import { AppContext } from '@/context/AppContext';

export default function Layout(props) {
  const { children } = props;
  const { state, dispatch } = useContext(AppContext);
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
