import React from 'react';
import { NavbarItem, Link } from '@nextui-org/react';

import Image from 'next/image';

import styles from '@/styles/MainNavigation.module.css';

export default function MainNavigation(props) {
  const { direction } = props;
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
        <Link href="/" aria-current="page">
          Home
        </Link>
      </NavbarItem>
      <NavbarItem isActive>
        <Link color="foreground" href="#">
          Features
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link color="foreground" href="#">
          Services
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link color="foreground" href="#">
          Contact
        </Link>
      </NavbarItem>
    </div>
  );
}
