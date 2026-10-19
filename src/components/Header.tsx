import React from 'react';
import './Header.module.css';
import Logo202 from './Logo202';

interface HeaderProps {
  onMenuPress: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuPress, title }) => {
  return (
    <header className="header">
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <Logo202 size={30} />
        </div>
        {/* Burger button */}
        <button
          className="burgerButton"
          onClick={onMenuPress}
          aria-label="Open menu"
        >
          <span className="burgerLine" />
          <span className="burgerLine" />
          <span className="burgerLine" />
        </button>
        {/* Title if provided */}
        {title && <h1 className="title">{title}</h1>}
      </div>
    </header>
  );
};

export default Header;
