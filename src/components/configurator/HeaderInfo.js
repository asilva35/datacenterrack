import React, { useContext } from 'react';
import styles from '@/styles/HeaderInfo.module.css';
import Image from '@/components/Image';
import { ConfiguratorContext } from '@/context/ConfiguratorContext';

export default function HeaderInfo(props) {
  const { state, dispatch } = useContext(ConfiguratorContext);
  return (
    <div
      className={`${styles.HeaderInfo} ${state.is360view ? styles.hide : ''}`}
    >
      <div className={styles.wrapper}>
        <div className={styles.title}>A 20</div>
        <div className={styles.subtitle}>349-40</div>
        <div className={styles.actions}>
          <div className={styles.viewInfo}>View Info</div>
          <div className={styles.arrow}>
            <Image
              src="/assets/images/arrow.png"
              width={61}
              height={16}
              alt="Next"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
