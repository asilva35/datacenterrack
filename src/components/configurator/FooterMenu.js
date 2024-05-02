import React, { useContext, useEffect, useState } from 'react';
import styles from '@/styles/FooterMenu.module.css';
import { AppContext } from '@/context/AppContext';

export default function FooterMenu() {
  const { state, dispatch } = useContext(AppContext);
  const [hide, setHide] = useState(false);
  useEffect(() => {
    if (state.is360view || state.showProductInfo) {
      setHide(true);
    } else {
      setHide(false);
    }
  }, [state.is360view, state.showProductInfo]);
  return (
    <div className={`${styles.FooterMenu} ${hide ? styles.hide : ''}`}>
      <div className={styles.wrapper}>
        <div className={styles.btnAbout}>About</div>
        <div className={styles.btnCredits}>Credits</div>
      </div>
    </div>
  );
}
