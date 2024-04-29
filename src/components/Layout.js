import React from 'react';
import TopBar from '@/components/TopBar';
import styles from '@/styles/Layout.module.css';

export default function Layout(props) {
  const { children, showTopBar, theme, navStyle } = props;
  return (
    <div className={`${styles.LayoutWrapper}`}>
      <TopBar showTopBar={showTopBar} theme={theme} navStyle={navStyle} />
      <div className={`${styles.LayoutBody}`}>{children}</div>
    </div>
  );
}
