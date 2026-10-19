export const tokens = {
  colors: {
    background: '#FFFFFF',
    cardLevel1: '#EFF2F9',
    cardLevel2: '#E4EBF1',
    divider: '#B5BFC6',
    textPrimary: '#6E7F8D',
    textAccent: '#4A5966', // darker shade for main text to achieve 4.5:1 contrast
  },
  shadows: {
    // For web, we'll use CSS box-shadow
    // Inner shadow is tricky; we'll use an inset box-shadow approximation or overlay method
    inner: `
      inset -5px -5px 10px #FAFBFF,
      inset 5px 5px 10px rgba(22, 27, 29, 0.23)
    `,
    outer: `
      -5px -5px 10px #FAFBFF,
      5px 5px 10px rgba(22, 27, 29, 0.23)
    `,
    // For pressed state: inner shadow becomes visible
    pressed: `
      inset -5px -5px 10px #FAFBFF,
      inset 5px 5px 10px rgba(22, 27, 29, 0.23)
    `,
    // For default state: outer shadow
    default: `
      -5px -5px 10px #FAFBFF,
      5px 5px 10px rgba(22, 27, 29, 0.23)
    `,
  },
  radii: {
    small: '24px',
    medium: '32px',
  },
  typography: {
    fontSizes: {
      h1: '32px',
      h2: '22px',
      h3: '16px',
      h4: '13px',
      h5: '11px',
    },
    fontWeights: {
      light: '300', // Light
      book: '400',  // Book
      medium: '500', // Medium
    },
    // We'll use system fonts with fallbacks
    fontFamilies: {
      heading: "'Avenir Next', 'Mulish', 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      body: "'Avenir Next', 'Mulish', 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
  },
  animation: {
    press: {
      scaleDown: 0.96,
      scaleOvershoot: 1.03,
      scaleFinal: 1.0,
      duration: 150, // ms for transition
    },
    cardAppear: {
      staggerDelay: 60, // ms
      // For web, we'll use CSS transition or animation
    },
    tabIndicator: {
      // elastic properties - we'll implement with CSS transition
    },
    screenTransition: {
      duration: 350, // ms
    },
  },
  touchableArea: {
    minWidth: '48px',
    minHeight: '48px',
  },
};

export default tokens;
