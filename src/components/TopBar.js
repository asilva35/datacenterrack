import styles from '@/styles/TopBar.module.css';
import Image from 'next/image';
import React, { useEffect } from 'react';
import MainNavigation from '@/components/MainNavigation';
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
} from '@nextui-org/react';

export default function TopBar(props) {
  const { showTopBar } = props;
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Navbar
      maxWidth="full"
      onMenuOpenChange={setIsMenuOpen}
      className={`${styles.Navbar} ${showTopBar ? styles.show : ''}`}
    >
      <NavbarBrand>
        <Link href="/">
          <Image
            src={`/assets/images/logo-white.svg`}
            width={129}
            height={40}
            alt="Logo"
            className={`${styles.logo}`}
          />
        </Link>
      </NavbarBrand>
      <NavbarMenuToggle
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        className="hide-md hide-lg hide-xl"
        icon={
          <Image
            src={`/assets/images/hamburguer-menu.svg`}
            width={34}
            height={20}
            alt="Menu"
          />
        }
      />
      <NavbarContent
        as="div"
        justify="end"
        className="hide-xss hide-xs hide-sm"
      >
        <MainNavigation direction="horizontal" />
      </NavbarContent>
      <NavbarMenu className={`${styles.NavbarMenu}`}>
        <div className={`${styles.MainNavigationCNT}`}>
          <MainNavigation direction="vertical" />
        </div>
      </NavbarMenu>
    </Navbar>
  );
}
