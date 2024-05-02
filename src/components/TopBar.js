import styles from '@/styles/TopBar.module.css';
import Image from 'next/image';
import React, { useContext, useEffect } from 'react';
import MainNavigation from '@/components/MainNavigation';
import { ConfiguratorContext } from '@/context/ConfiguratorContext';
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
} from '@nextui-org/react';

export default function TopBar(props) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { state, dispatch } = useContext(ConfiguratorContext);

  return (
    <Navbar
      maxWidth="full"
      onMenuOpenChange={setIsMenuOpen}
      className={`${styles.Navbar} ${
        state.showTopBar && !state.is360view ? styles.show : ''
      } ${styles[state.theme]}`}
    >
      <NavbarBrand>
        <Link href="/">
          <Image
            src={
              state.theme === 'dark'
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
        {state.navStyle === '02' && `Menu`}
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className={state.navStyle === '01' ? `hide-md hide-lg hide-xl` : ''}
          icon={
            <Image
              src={
                state.theme === 'dark'
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
      {state.navStyle === '01' && (
        <NavbarContent
          as="div"
          justify="end"
          className="hide-xss hide-xs hide-sm"
        >
          <MainNavigation direction="horizontal" theme={state.theme} />
        </NavbarContent>
      )}
      <NavbarMenu className={`${styles.NavbarMenu}`}>
        <div className={`${styles.MainNavigationCNT}`}>
          <MainNavigation direction="vertical" theme={state.theme} />
        </div>
      </NavbarMenu>
    </Navbar>
  );
}
