/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                darkblue: "#010725",
                midnightblue: "#010d50",
                white: "#fff",
                gray: {
                    100: "#1a203b",
                    200: "rgba(255, 255, 255, 0.4)",
                    300: "rgba(255, 255, 255, 0.1)",
                    400: "rgba(255, 255, 255, 0.3)",
                    500: "#13182e",
                },
                blue: "#0328ee",
                darkgray: "#a2a2a2",
                ghostwhite: "rgba(241, 241, 249, 0.3)",
                "dark-blue": "#010d50",
                gainsboro: "#dedede",
                silver: {
                    100: "#c4c4c4",
                    200: "#c3c3c3",
                },
                navy: "#041b94",
                darkslateblue: "#192251",
            },
            borderRadius: {
                "21xl": "40px",
                "11xl": "30px",
                "981xl": "1000px",
                "61xl": "80px",
                "smi-5": "12.5px",
                sm: "14px",
                smi: "13px",
                xl: "20px",
                24: "24px",
            },
            screens: {
                dev500: "500px",
                dev450: "450px",
                dev400: "400px",
                dev350: "350px",
                dev1024: "1024px",
            },

            mixBlendMode: {
                luminosity: "luminosity",
            },
        },
        fontSize: {
            base: "16px",
            sm: "14px",
            lg: "18px",
            xl: "22px",
            "2xs": "11px",
            xs: "12px",
            "3xs": "10px",
            mini: "15px",
            40: "40px",
            "23xl": "42px",
        },
    },
    corePlugins: {
        preflight: false,
    },
    plugins: [require("@tailwindcss/forms")],
};
