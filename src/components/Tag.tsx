import React from 'react';
import './Tag.module.css';
import tokens from '../theme/tokens';

interface TagProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'default';
  size?: 'small' | 'medium' | 'large';
}

const Tag: React.FC<TagProps> = ({ text, variant = 'default', size = 'medium' }) => {
  let backgroundColor = tokens.colors.cardLevel1;
  let textColor = tokens.colors.textPrimary;

  switch (variant) {
    case 'primary':
      backgroundColor = tokens.colors.cardLevel1;
      textColor = tokens.colors.textPrimary;
      break;
    case 'secondary':
      backgroundColor = tokens.colors.cardLevel2;
      textColor = tokens.colors.textPrimary;
      break;
    case 'danger':
      backgroundColor = tokens.colors.cardLevel1;
      textColor = tokens.colors.textPrimary; // We don't have a red in palette, so use textPrimary
      break;
    case 'default':
    default:
      backgroundColor = tokens.colors.cardLevel1;
      textColor = tokens.colors.textPrimary;
  }

  // Size styles
  let sizeStyle = {};
  switch (size) {
    case 'small':
      sizeStyle = { 
        padding: '2px 6px',
        fontSize: tokens.typography.fontSizes.h5
      };
      break;
    case 'medium':
      sizeStyle = { 
        padding: '4px 10px',
        fontSize: tokens.typography.fontSizes.h5
      };
      break;
    case 'large':
      sizeStyle = { 
        padding: '6px 14px',
        fontSize: tokens.typography.fontSizes.h4
      };
      break;
    default:
      sizeStyle = { 
        padding: '4px 10px',
        fontSize: tokens.typography.fontSizes.h5
      };
  }

  return (
    <span
      className="tag"
      style={{
        backgroundColor,
        color: textColor,
        borderRadius: '12px',
        ...sizeStyle,
      }}
    >
      {text}
    </span>
  );
};

export default Tag;
