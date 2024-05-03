import React, { useContext, useEffect, useState } from 'react';
import styles from '@/styles/LoadingScreen.module.css';
import { AppContext } from '@/context/AppContext';

export default function LoadingScreen() {
  const { state, dispatch } = useContext(AppContext);
  const [hide, setHide] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Loading Progress: 0%');
  useEffect(() => {
    if (state.show3DModel) {
      setHide(true);
    } else {
      setHide(false);
    }
  }, [state.show3DModel]);

  useEffect(() => {
    setLoadingProgress(state.loading.progress);
    setLoadingText(state.loading.text);
  }, [state.loading.progress, state.loading.text]);
  return (
    <div className={`${styles.LoadingScreen} ${hide ? styles.hide : ''}`}>
      <div className={`${styles.wrapper}`}>
        <div className={`${styles.loadingBar}`}>
          <div
            className={`${styles.loadingBarProgress}`}
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
        <div className={`${styles.loadingText}`}>{loadingText}</div>
      </div>
    </div>
  );
}
