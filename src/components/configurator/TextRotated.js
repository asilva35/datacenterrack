import React, { useContext, useEffect, useState } from 'react';
import styles from '@/styles/TextRotated.module.css';
import { AppContext } from '@/context/AppContext';

export default function TextRotated(props) {
  const { state, dispatch } = useContext(AppContext);
  const [hide, setHide] = useState(true);
  useEffect(() => {
    if (!state.show3DModel || state.is360view || state.showProductInfo) {
      setHide(true);
    } else {
      setHide(false);
    }
  }, [state.show3DModel, state.is360view, state.showProductInfo]);
  return (
    <div className={`${styles.TextRotated} ${hide ? styles.hide : ''}`}>
      <span>Data Center Gabinets Racks</span>
    </div>
  );
}
