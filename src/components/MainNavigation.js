import React from 'react';
import { NavbarItem, Link } from '@nextui-org/react';

import Image from 'next/image';

import styles from '@/styles/MainNavigation.module.css';
import { useRouter } from 'next/router';

export default function MainNavigation(props) {
  const { direction } = props;
  const [currentPage, setCurrentPage] = React.useState('#header');
  const router = useRouter();
  const onClickMenu = (path) => {
    router.push(path);
  };

  const onSelectOption = (option) => {
    if (option && option.search('#') === 0) {
      document.querySelector(option).scrollIntoView();
      setCurrentPage(option);
    }
  };

  return (
    <div className={`${styles.MainNavigation} ${styles[direction]}`}>
      <NavbarItem>
        <Link
          onClick={() => {
            onSelectOption('#header');
          }}
          className={`${
            currentPage === '#header' ? styles.selected : styles.link
          }`}
        >
          Home
        </Link>
      </NavbarItem>
      <NavbarItem isActive>
        <Link
          color="foreground"
          onClick={() => {
            onSelectOption('#partners');
          }}
          className={`${
            currentPage === '#partners' ? styles.selected : styles.link
          }`}
        >
          Partners
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link
          color="foreground"
          onClick={() => {
            onSelectOption('#services');
          }}
          className={`${
            currentPage === '#services' ? styles.selected : styles.link
          }`}
        >
          Services
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link
          color="foreground"
          onClick={() => {
            onSelectOption('#contact');
          }}
          className={`${
            currentPage === '#contact' ? styles.selected : styles.link
          }`}
        >
          Contact
        </Link>
      </NavbarItem>
    </div>
  );
}
