import React, { useContext, useEffect, useState } from 'react';
import styles from '@/styles/HeaderInfo.module.css';
import Image from '@/components/Image';
import { AppContext } from '@/context/AppContext';

export default function HeaderInfo(props) {
  const { state, dispatch } = useContext(AppContext);
  const [hide, setHide] = useState(false);
  useEffect(() => {
    if (state.is360view || state.showProductInfo) {
      setHide(true);
    } else {
      setHide(false);
    }
  }, [state.is360view, state.showProductInfo]);
  const onClickViewInfo = () => {
    dispatch({
      type: 'SHOW_PRODUCT_INFO',
      showProductInfo: true,
    });
  };
  return (
    <div className={`${styles.HeaderInfo} ${hide ? styles.hide : ''}`}>
      <div className={styles.wrapper}>
        <div className={styles.title}>A 20</div>
        <div className={styles.subtitle}>349-40</div>
        <div className={styles.actions}>
          <div className={styles.viewInfo} onClick={onClickViewInfo}>
            View Info
          </div>
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
