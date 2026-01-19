/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'grunge': ['"Metal Mania"', 'cursive'],
                'hand': ['"Rock Salt"', 'cursive'],
                'sans': ['Inter', 'sans-serif'],
            },
            colors: {
                'lyoki-red': '#ff0000',
                'lyoki-black': '#0a0a0a',
                'lyoki-gray': '#f5f5f5'
            },
            backgroundImage: {
                'noise': "url('https://grainy-gradients.vercel.app/noise.svg')", // Texture
            }
        },
    },
    plugins: [],
}
