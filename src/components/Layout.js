import React, { useEffect } from 'react';
import TopBar from '@/components/TopBar';
import styles from '@/styles/Layout.module.css';

export default function Layout(props) {
  const { children, showTopBar, theme, navStyle, is360view, state } = props;
  useEffect(() => {
    console.log('state', state);
  }, [state]);
  return (
    <div
      className={`${styles.LayoutWrapper} ${
        is360view ? styles.pointerEventsNone : ''
      }`}
    >
      <TopBar
        showTopBar={showTopBar}
        theme={theme}
        navStyle={navStyle}
        is360view={is360view}
      />
      <div className={`${styles.LayoutBody}`}>{children}</div>
    </div>
  );
}
