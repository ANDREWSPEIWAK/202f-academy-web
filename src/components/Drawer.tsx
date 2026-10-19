import React from 'react';
import './Drawer.module.css';

interface DrawerProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ visible, onClose, children }) => {
  return (
    <>
      {/* Backdrop */}
      {visible && (
        <div
          className="backdrop"
          onClick={onClose}
        />
      )}
      {/* Drawer content */}
      <div
        className={`${"drawer"} ${visible ? "open" : ''}`}
      >
        <div className="drawerContent">
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;
