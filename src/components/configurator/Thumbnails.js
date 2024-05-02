import React, { useContext } from 'react';
import styles from '@/styles/Thumbnails.module.css';
import Image from '@/components/Image';
import { AppContext } from '@/context/AppContext';

export default function Thumbnails() {
  const { state, dispatch } = useContext(AppContext);
  return (
    <div
      className={`${styles.Thumbnails} ${state.is360view ? styles.hide : ''}`}
    >
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
