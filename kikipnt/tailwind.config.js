/** @type {import('tailwindcss').Config} */
module.exports = {
    future: {
        // https://github.com/tailwindlabs/tailwindcss/discussions/1739#discussioncomment-3630717
        hoverOnlyWhenSupported: true,
    },
    content: ['./src/**/*.{html,js,json}', './node_modules/flowbite/**/*.js'],
    theme: {
        extend: {
            screens: {
                xs: '380px',
            },
            // https://stackoverflow.com/questions/61508409/how-to-change-tailwind-config-js-dynamically-based-on-user-settings-in-rails
            backdropBlur: {
                variable: 'var(--blur-var)',
            },
        },
        fontFamily: {
            sans: ['Ubuntu'],
        },
    },
    plugins: [
        require('tailwind-nord'),
        // require('flowbite/plugin'),
        require('@tailwindcss/forms'),
    ],
    darkMode: 'class',
};
