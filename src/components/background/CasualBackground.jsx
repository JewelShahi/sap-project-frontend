import React, { useMemo } from 'react';

const CasualBackground = ({ seed, children }) => {
  const styles = useMemo(() => {
    const palettes = [
      /* COLD */
      { colors: ['#e0f2fe', '#e0e7ff'] },
      { colors: ['#f0fdf4', '#dcfce7'] },
      { colors: ['#f0f9ff', '#e0f2fe'] },
      { colors: ['#faf5ff', '#f3e8ff'] },
      /* WARM */
      { colors: ['#fff7ed', '#ffedd5'] },
      { colors: ['#fdf2f8', '#fce7f3'] },
      { colors: ['#fffbeb', '#fef3c7'] },
      { colors: ['#fff1f2', '#ffe4e6'] },
    ];

    // Create a stable index based on the seed string
    const charSum = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const selected = palettes[charSum % palettes.length].colors;

    return {
      wrapper: {
        position: 'relative',
        borderRadius: '12px',
        padding: '20px',
        margin: '12px 0',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.04)',
      },
      bgLayer: {
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        background: `linear-gradient(135deg, ${selected[0]} 0%, ${selected[1]} 100%)`,
      },
      contentLayer: {
        position: 'relative',
        zIndex: 1,
      }
    };
  }, [seed]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.bgLayer} />
      <div style={styles.contentLayer}>
        <>{children}</>
      </div>
    </div>
  );
};

export default CasualBackground;