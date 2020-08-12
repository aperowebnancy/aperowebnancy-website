const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    purge: ['./components/**/*.js', './pages/**/*.js'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Lato', ...defaultTheme.fontFamily.sans],
                serif: ['Lato', ...defaultTheme.fontFamily.serif],
            },
        },
        container: {
            padding: '1rem',
        },
    },
    variants: {},
    plugins: [],
};
