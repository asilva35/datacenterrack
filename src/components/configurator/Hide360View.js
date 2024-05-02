import React, { useContext } from 'react';
import styles from '@/styles/Hide360View.module.css';
import Image from '@/components/Image';
import { AppContext } from '@/context/AppContext';

export default function Hide360View(props) {
  const { state, dispatch } = useContext(AppContext);
  const onClickHide360 = () => {
    dispatch({
      type: 'SET_360_VIEW',
      is360view: false,
    });
  };
  return (
    <div
      className={`${styles.Hide360View} ${state.is360view ? styles.show : ''}`}
    >
      <div className={styles.wrapper} onClick={onClickHide360}>
        <Image
          src="/assets/images/close-360-icon.png"
          width={46}
          height={46}
          alt="Close"
        />
      </div>
    </div>
  );
}
