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
  const { showTopBar, theme, navStyle, is360view } = props;
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Navbar
      maxWidth="full"
      onMenuOpenChange={setIsMenuOpen}
      className={`${styles.Navbar} ${
        showTopBar && !is360view ? styles.show : ''
      } ${styles[theme]}`}
    >
      <NavbarBrand>
        <Link href="/">
          <Image
            src={
              theme === 'dark'
                ? `/assets/images/logo-white.svg`
                : `/assets/images/logo-dark.svg`
            }
            width={129}
            height={40}
            alt="Logo"
            className={`${styles.logo}`}
          />
        </Link>
      </NavbarBrand>
      <NavbarContent as="div" className={`${styles.LabelMenu}`}>
        {navStyle === '02' && `Menu`}
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className={navStyle === '01' ? `hide-md hide-lg hide-xl` : ''}
          icon={
            <Image
              src={
                theme === 'dark'
                  ? `/assets/images/hamburguer-menu-light.svg`
                  : `/assets/images/hamburguer-menu-dark.svg`
              }
              width={34}
              height={20}
              alt="Menu"
            />
          }
        />
      </NavbarContent>
      {navStyle === '01' && (
        <NavbarContent
          as="div"
          justify="end"
          className="hide-xss hide-xs hide-sm"
        >
          <MainNavigation direction="horizontal" theme={theme} />
        </NavbarContent>
      )}
      <NavbarMenu className={`${styles.NavbarMenu}`}>
        <div className={`${styles.MainNavigationCNT}`}>
          <MainNavigation direction="vertical" theme={theme} />
        </div>
      </NavbarMenu>
    </Navbar>
  );
}
