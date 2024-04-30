import React from 'react';
import styles from '@/styles/Hide360View.module.css';
import Image from '@/components/Image';

export default function Hide360View(props) {
  const { is360view } = props;
  const onClickHide360 = () => {
    if (props.onClickHide360) props.onClickHide360();
  };
  return (
    <div className={`${styles.Hide360View} ${is360view ? styles.show : ''}`}>
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
