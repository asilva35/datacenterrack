import React, { useContext, useEffect, useState } from 'react';
import styles from '@/styles/AddonsMenu.module.css';
import Image from '@/components/Image';
import { AppContext } from '@/context/AppContext';

export default function AddonsMenu(props) {
  const { state, dispatch } = useContext(AppContext);
  const [hide, setHide] = useState(false);
  useEffect(() => {
    if (state.is360view || state.showProductInfo) {
      setHide(true);
    } else {
      setHide(false);
    }
  }, [state.is360view, state.showProductInfo]);
  const onClick360 = () => {
    dispatch({
      type: 'SET_360_VIEW',
      is360view: true,
    });
  };
  return (
    <div className={`${styles.AddonsMenu} ${hide ? styles.hide : ''}`}>
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
        <div className={styles.Icon360} onClick={onClick360}>
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
