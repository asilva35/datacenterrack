import React, { useEffect, useContext } from 'react';
import TopBar from '@/components/TopBar';
import styles from '@/styles/Layout.module.css';
import { ConfiguratorContext } from '@/context/ConfiguratorContext';

export default function Layout(props) {
  const { children, showTopBar, theme, navStyle } = props;
  const { state, dispatch } = useContext(ConfiguratorContext);
  return (
    <div
      className={`${styles.LayoutWrapper} ${
        state.is360view ? styles.pointerEventsNone : ''
      }`}
    >
      <TopBar showTopBar={showTopBar} theme={theme} navStyle={navStyle} />
      <div className={`${styles.LayoutBody}`}>{children}</div>
    </div>
  );
}
