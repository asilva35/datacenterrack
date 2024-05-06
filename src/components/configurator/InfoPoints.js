import React, { useContext, useEffect, useState } from 'react';
import styles from '@/styles/InfoPoints.module.css';
import { AppContext } from '@/context/AppContext';

export default function InfoPoints(props) {
  const { config } = props;
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
    <div className={`${styles.InfoPoints} ${show ? styles.show : ''}`}>
      <div className={`${styles.wrapper}`}>
        <div className={`${styles.points}`}>
          {config.products.map((product, i) => {
            return (
              <div
                key={`product-info-points-${i}`}
                className={`${styles.productInfoPoints}`}
              >
                {product.infoPoints.map((point, ii) => {
                  return (
                    <div
                      key={`product-info-point-${ii}`}
                      className={`${styles.point} ${point.element}`}
                    >
                      <div className={`${styles.pointBorder}`}>
                        <div className={`${styles.pointBody}`}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {/* <div
            className={`${styles.point} ${config.products[0].infoPoints[0].element}`}
          >
            <div className={`${styles.pointBorder}`}>
              <div className={`${styles.pointBody}`}></div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
