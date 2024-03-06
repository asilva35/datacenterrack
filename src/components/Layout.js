import React from 'react';
import TopBar from '@/components/TopBar';
import styles from '@/styles/Layout.module.css';

export default function Layout({ children }) {
  return (
    <div className={`${styles.LayoutWrapper}`}>
      <TopBar />
      <div className={`${styles.LayoutBody}`}>{children}</div>
    </div>
  );
}
