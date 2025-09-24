/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'hover:bg-[var(--sideBarItemHoverBackColor)]',
    'hover:text-[var(--sideBarItemHoverForeColor)]'
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: 'var(--primaryColor)',
        secondaryColor: 'var(--secondaryColor)',

        headerBg: 'var(--headerBackColor)',
        headerText: 'var(--headerForeColor)',
        subHeaderBg: 'var(--subHeaderBackColor)',
        subHeaderText: 'var(--subHeaderForeColor)',

        primaryButtonBg: 'var(--primaryButtonBackColor)',
        primaryButtonText: 'var(--primaryButtonForeColor)',
        secondaryButtonBg: 'var(--secondaryButtonBackColor)',
        secondaryButtonText: 'var(--secondaryButtonForeColor)',

        sidebarBg: 'var(--sideBarBackColor)',
        sidebarBgSelect: 'var(--sideBarActiveBackColor)',
        sidebarTextSelect: 'var(--sideBarActiveForeColor)',
        sidebarText: 'var(--sideBarForeColor)',
        sidebarItemHoverSelect: 'var(--sideBarItemHoverBackColor)',
        sidebarItemHover: 'var(--sideBarItemHoverForeColor)',
        sidebarSeprator: 'var(--sideBarItemSeparatorColor)',

        gridHeaderBg: 'var(--gridHeaderBackColor)',
        gridHeaderText: 'var(--gridHeaderForeColor)',
        gridRowPrimaryBg: 'var(--gridRowBackColor)',
        gridRowPrimaryText: 'var(--gridRowForeColor)',
        gridRowAlternateBg: 'var(--gridRowAltBackColor)',
        gridRowAlternateText: 'var(--gridRowAltForeColor)',
        gridRowHoverBg: 'var(--gridRowHoverBackColor)',

        cardBg: 'var(--cardBackColor)',
        cardText: 'var(--cardForeColor)',
        cardHoverBg: 'var(--cardHoverBackColor)',
        cardHoverText: 'var(--cardHoverForeColor)',
      }
    },
    fontSize: {
      'xs-fluid': 'clamp(0.75rem, 1vw, 0.875rem)', // 12px → 14px
      'sm-fluid': 'clamp(0.875rem, 1vw, 1rem)', // 14px → 16px
      'base-fluid': 'clamp(1rem, 1.2vw, 1.125rem)', // 16px → 18px
      'lg-fluid': 'clamp(1.125rem, 1.5vw, 1.25rem)', // 18px → 20px
      'xl-fluid': 'clamp(1.25rem, 2vw, 1.5rem)', // 20px → 24px
      '2xl-fluid': 'clamp(1.5rem, 2.5vw, 1.875rem)', // 24px → 30px
      '3xl-fluid': 'clamp(1.875rem, 3vw, 2.25rem)', // 30px → 36px
      '4xl-fluid': 'clamp(2.25rem, 4vw, 3rem)', // 36px → 48px
    },
    fontFamily: {
      custom: "var(--fontFamily, 'sans-serif')", // fallback to Roboto
    },
    // screens: {
    //   sm: '640px',
    //   md: '768px',
    //   lg: '1024px',
    //   xl: '1280px',
    //   '2xl': '1536px',
    // },
  },
  plugins: [ require('tailwind-scrollbar'),],
}

