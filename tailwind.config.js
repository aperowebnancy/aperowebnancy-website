const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    purge: ['./components/**/*.js', './pages/**/*.js', './talks/*.mdx'],
    theme: {
        extend: {
            spacing: {
                '9/16': '56.25%',
            },
            fontFamily: {
                sans: ['Lato', ...defaultTheme.fontFamily.sans],
                serif: ['Lato', ...defaultTheme.fontFamily.serif],
            },
        },
        container: {
            padding: '1rem',
        },
        typography: (theme) => ({
            default: {
                css: {
                    color: theme('colors.gray.700'),
                    h2: {
                        fontWeight: '700',
                        letterSpacing: theme('letterSpacing.tight'),
                        color: theme('colors.gray.900'),
                    },
                    h3: {
                        fontWeight: '600',
                        color: theme('colors.gray.900'),
                    },
                    'ol li:before': {
                        fontWeight: '600',
                        color: theme('colors.gray.500'),
                    },
                    'ul li:before': {
                        backgroundColor: theme('colors.gray.400'),
                    },
                    a: {
                        color: theme('colors.gray.900'),
                    },
                    blockquote: {
                        color: theme('colors.gray.900'),
                        borderLeftColor: theme('colors.gray.200'),
                    },
                },
            },
        }),
    },
    variants: {},
    plugins: [require('@tailwindcss/typography')],
};
