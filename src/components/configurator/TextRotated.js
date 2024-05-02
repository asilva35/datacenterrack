import React, { useContext } from 'react';
import styles from '@/styles/TextRotated.module.css';
import { AppContext } from '@/context/AppContext';

export default function TextRotated(props) {
  const { state, dispatch } = useContext(AppContext);
  return (
    <div
      className={`${styles.TextRotated} ${state.is360view ? styles.hide : ''}`}
    >
      <span>Data Center Gabinets Racks</span>
    </div>
  );
}
