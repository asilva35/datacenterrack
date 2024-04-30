import React from 'react';
import styles from '@/styles/AddonsMenu.module.css';
import Image from '@/components/Image';

export default function AddonsMenu(props) {
  return (
    <div className={styles.AddonsMenu}>
      <div className={styles.wrapper}>
        <div className={styles.title}>Addons</div>
        <div className={styles.menus}>
          <ul>
            {Array(6)
              .fill(null)
              .map((_, i) => (
                <li key={i}>
                  <Image
                    src={`/assets/images/addons/0${i + 1}.png`}
                    width={54}
                    height={50}
                    alt={`Addon 0${i + 1}`}
                  />
                </li>
              ))}
          </ul>
        </div>
        <div
          className={styles.Icon360}
          onClick={() => {
            if (props.onClick360) props.onClick360();
          }}
        >
          <Image
            src="/assets/images/360-icon.png"
            alt="360"
            width={209}
            height={83}
          />
        </div>
      </div>
    </div>
  );
}
