import React, { useContext } from 'react';
import styles from '@/styles/TextRotated.module.css';
import { ConfiguratorContext } from '@/context/ConfiguratorContext';

export default function TextRotated(props) {
  const { state, dispatch } = useContext(ConfiguratorContext);
  return (
    <div
      className={`${styles.TextRotated} ${state.is360view ? styles.hide : ''}`}
    >
      <span>Data Center Gabinets Racks</span>
    </div>
  );
}
