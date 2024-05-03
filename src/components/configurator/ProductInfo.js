import React, { useContext, useEffect, useState } from 'react';
import styles from '@/styles/ProductInfo.module.css';
import { AppContext } from '@/context/AppContext';
import Image from '@/components/Image';

export default function ProductInfo() {
  const { state, dispatch } = useContext(AppContext);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (state.showProductInfo) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [state.is360view, state.showProductInfo]);
  const onCloseProductInfo = () => {
    dispatch({
      type: 'SHOW_PRODUCT_INFO',
      showProductInfo: false,
    });
  };
  return (
    <div className={`${styles.ProductInfo} ${show ? styles.show : ''}`}>
      <div className={`${styles.wrapper}`}>
        <div className={`${styles.top}`}>
          <div className={`${styles.close}`} onClick={onCloseProductInfo}>
            <Image
              src="/assets/images/close-icon.png"
              width={46}
              height={46}
              alt="Close"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
