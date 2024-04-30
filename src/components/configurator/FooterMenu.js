import React from 'react';
import styles from '@/styles/FooterMenu.module.css';

export default function FooterMenu() {
  return (
    <div className={styles.FooterMenu}>
      <div className={styles.wrapper}>
        <div className={styles.btnAbout}>About</div>
        <div className={styles.btnCredits}>Credits</div>
      </div>
    </div>
  );
}
