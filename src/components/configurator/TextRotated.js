import React from 'react';
import styles from '@/styles/TextRotated.module.css';

export default function TextRotated(props) {
  const { is360view } = props;
  return (
    <div className={`${styles.TextRotated} ${is360view ? styles.hide : ''}`}>
      <span>Data Center Gabinets Racks</span>
    </div>
  );
}
