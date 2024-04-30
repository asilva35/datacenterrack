import React from 'react';
import styles from '@/styles/Thumbnails.module.css';
import Image from '@/components/Image';

export default function Thumbnails() {
  return (
    <div className={`${styles.Thumbnails}`}>
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
