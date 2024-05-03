import React, { useContext, useEffect, useState } from 'react';
import styles from '@/styles/Thumbnails.module.css';
import Image from '@/components/Image';
import { AppContext } from '@/context/AppContext';

export default function Thumbnails() {
  const { state, dispatch } = useContext(AppContext);
  const [hide, setHide] = useState(true);
  useEffect(() => {
    if (!state.show3DModel || state.is360view || state.showProductInfo) {
      setHide(true);
    } else {
      setHide(false);
    }
  }, [state.show3DModel, state.is360view, state.showProductInfo]);
  return (
    <div className={`${styles.Thumbnails} ${hide ? styles.hide : ''}`}>
      <div className={`${styles.wrapper}`}>
        <ul>
          <li>
            <Image
              src="/assets/images/temp/thumbnail-01.png"
              width={78}
              height={78}
              alt="Nxrt 24"
            />
          </li>
          <li>
            <Image
              src="/assets/images/temp/thumbnail-01.png"
              width={78}
              height={78}
              alt="Nxrt 24"
            />
          </li>
          <li>
            <Image
              src="/assets/images/temp/thumbnail-01.png"
              width={78}
              height={78}
              alt="Nxrt 24"
            />
          </li>
        </ul>
      </div>
    </div>
  );
}
