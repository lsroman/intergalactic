import React from 'react';

export const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({ children, ...other }) => {
  return (
    <span
      style={{
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: 0,
      }}
      {...other}
    >
      {children}
    </span>
  );
};
ScreenReaderOnly.displayName = 'ScreenReaderOnlyRoot';
