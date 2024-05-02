import React, { useContext, useEffect, useState } from 'react';
import styles from '@/styles/BG.module.css';
import { AppContext } from '@/context/AppContext';

export default function BG() {
  const { state, dispatch } = useContext(AppContext);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (state.showProductInfo) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [state.is360view, state.showProductInfo]);
  return (
    <div className={`${styles.BG}`}>
      <div
        className={`${styles.BGViewProduct} ${show ? styles.show : ''}`}
      ></div>
    </div>
  );
}
