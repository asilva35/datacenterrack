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
        <div className={`${styles.body}`}>
          <div className={`${styles.textCnt}`}>
            <h4 className={`${styles.title}`}>Sturdy Design</h4>
            <div className={`${styles.text}`}>
              <ul>
                <li>Strong bolted frame made of steel closed profiles.</li>
                <li>
                  Maximum load capacity: 1500 kg for cabinet based on levelling
                  feet, 1750 kg for cabinet without feet, based directly on the
                  floor.
                </li>
              </ul>
            </div>
          </div>
          <div className={`${styles.textCnt}`}>
            <h4 className={`${styles.title}`}>Safety</h4>
            <div className={`${styles.text}`}>
              <ul>
                <li>
                  Multi-point cabinet locking system: 5-point locking system in
                  single-leaf doors; 3-point locking system in double-leaf doors
                  (5-point locking system as an option if adapting set is used).
                </li>
                <li>Locks with access control are available.</li>
              </ul>
            </div>
          </div>
          <div className={`${styles.textCnt}`}>
            <h4 className={`${styles.title}`}>Multipurpose</h4>
            <div className={`${styles.text}`}>
              <ul>
                <li>
                  Smooth tool-free adjustment of 19&quot; mounting profiles.
                </li>
                <li>
                  Mounting profiles are U-marked to simplify installation.
                </li>
                <li>
                  The width can be changed from 19&quot; to 21&quot; with no
                  need to use additional mounting elemens (in 800 mm wide
                  cabinets).
                </li>
                <li>
                  Door opening angle up to 270 degrees, adjustable direction of
                  opening.
                </li>
                <li>Easy installation thanks to split side panels.</li>
                <li>
                  Optional mounting of partitions between cabinets at any time
                  of their operation.
                </li>
                <li>Tool-free mounting of the top plate of cabinet.</li>
                <li>The frame includes holes for mounting accessories.</li>
              </ul>
            </div>
          </div>
          <div className={`${styles.textCnt}`}>
            <h4 className={`${styles.title}`}>
              Reference chart and Configurator
            </h4>
            <div className={`${styles.text}`}>
              <table>
                <thead>
                  <tr>
                    <th>Width</th>
                    <th>Depth</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>600</td>
                    <td>800</td>
                    <td>UX-23455</td>
                  </tr>
                  <tr>
                    <td>450</td>
                    <td>500</td>
                    <td>UX-48789</td>
                  </tr>
                  <tr>
                    <td>300</td>
                    <td>650</td>
                    <td>ZB-45256</td>
                  </tr>
                  <tr>
                    <td>900</td>
                    <td>400</td>
                    <td>CV-12456</td>
                  </tr>
                  <tr>
                    <td>600</td>
                    <td>800</td>
                    <td>UX-23455</td>
                  </tr>
                  <tr>
                    <td>450</td>
                    <td>500</td>
                    <td>UX-48789</td>
                  </tr>
                  <tr>
                    <td>300</td>
                    <td>650</td>
                    <td>ZB-45256</td>
                  </tr>
                  <tr>
                    <td>900</td>
                    <td>400</td>
                    <td>CV-12456</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
