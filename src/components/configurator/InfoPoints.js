import React, { useContext, useEffect, useState } from 'react';
import styles from '@/styles/InfoPoints.module.css';
import { AppContext } from '@/context/AppContext';

export default function InfoPoints(props) {
  const { config } = props;
  const { state, dispatch } = useContext(AppContext);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (state.showProductInfo && !state.showProductPartInfo) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [state.showProductInfo, state.showProductPartInfo]);
  const onClickPoint = (point) => {
    dispatch({
      type: 'ON_CLICK_INFO_POINT',
      currentInfoPoint: point,
    });
    dispatch({
      type: 'SHOW_PRODUCT_PART_INFO',
      showProductPartInfo: true,
    });
  };
  return (
    <div className={`${styles.InfoPoints} ${show ? styles.show : ''}`}>
      <div className={`${styles.wrapper}`}>
        <div className={`${styles.points} info-point`}>
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
                      onClick={() => {
                        onClickPoint(point);
                      }}
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
        </div>
      </div>
    </div>
  );
}
