import React, { useContext } from 'react';
import styles from '@/styles/FooterMenu.module.css';
import { ConfiguratorContext } from '@/context/ConfiguratorContext';

export default function FooterMenu() {
  const { state, dispatch } = useContext(ConfiguratorContext);
  return (
    <div
      className={`${styles.FooterMenu} ${state.is360view ? styles.hide : ''}`}
    >
      <div className={styles.wrapper}>
        <div className={styles.btnAbout}>About</div>
        <div className={styles.btnCredits}>Credits</div>
      </div>
    </div>
  );
}
