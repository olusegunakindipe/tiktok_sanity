import React, { useEffect, MouseEvent } from 'react';

interface IProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  height?: string;
  radius?: string;
  width?: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  color?: string;
  border?: string;
}

const Button = ({
  children,
  height,
  radius,
  width,
  border,
  variant,
  onClick,
}: IProps) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: variant == 'primary' ? '#efefef' : '#F51997',
        border,
        borderRadius: radius,
        height,
        width,
        // padding: '10px',
      }}
    >
      {children}
    </button>
  );
};

export default Button;
