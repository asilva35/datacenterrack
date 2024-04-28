import React from 'react';
import TopBar from '@/components/TopBar';
import styles from '@/styles/Layout.module.css';

export default function Layout(props) {
  const { children, showTopBar } = props;
  return (
    <div className={`${styles.LayoutWrapper}`}>
      <TopBar showTopBar={showTopBar} />
      <div className={`${styles.LayoutBody}`}>{children}</div>
    </div>
  );
}
