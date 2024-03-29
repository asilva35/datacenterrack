import React from 'react';
import { NavbarItem, Link } from '@nextui-org/react';

import Image from 'next/image';

import styles from '@/styles/MainNavigation.module.css';

export default function MainNavigation(props) {
  const { direction } = props;
  const [currentPage, setCurrentPage] = React.useState('home');
  const [selectedOption, setSelectedOption] = React.useState('');
  const onClickMenu = (path) => {
    router.push(path);
  };

  const onSelectOption = (option) => {
    setSelectedOption(option);
    if (option.has('home')) return onClickMenu('/');
  };

  return (
    <div className={`${styles.MainNavigation} ${styles[direction]}`}>
      <NavbarItem>
        <Link
          href="/"
          className={`${
            currentPage === 'home' ? styles.selected : styles.link
          }`}
        >
          Home
        </Link>
      </NavbarItem>
      <NavbarItem isActive>
        <Link
          color="foreground"
          href="#partners"
          className={`${
            currentPage === 'features' ? styles.selected : styles.link
          }`}
        >
          Partners
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link
          color="foreground"
          href="#"
          className={`${
            currentPage === 'services' ? styles.selected : styles.link
          }`}
        >
          Services
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link
          color="foreground"
          href="#"
          className={`${
            currentPage === 'contact' ? styles.selected : styles.link
          }`}
        >
          Contact
        </Link>
      </NavbarItem>
    </div>
  );
}
