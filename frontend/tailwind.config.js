/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
		 animation: {
      'fade-in': 'fadeIn 0.3s ease-out',
      'fade-out': 'fadeOut 0.3s ease-in',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: 0, transform: 'translateY(-10px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
      fadeOut: {
        '0%': { opacity: 1, transform: 'translateY(0)' },
        '100%': { opacity: 0, transform: 'translateY(-10px)' },
      },
    },
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		   fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
		 animation: {
    'spin-slow': 'spin 10s linear infinite',
    'fade-in-up': 'fadeInUp 1s ease-out',
  },
  keyframes: {
    fadeInUp: {
      '0%': { opacity: 0, transform: 'translateY(20px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
  },
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	},
	 animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out both',
      },
	   keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
  },
  plugins: [
    require('tailwindcss/plugin')(function({ addBase }) {
      addBase({
        '::-webkit-scrollbar': { width: '6px', height: '6px' },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': { backgroundColor: 'transparent', borderRadius: '999px' },
        '::-webkit-scrollbar-thumb:hover': { backgroundColor: '#cbd5e1' }
      });
    })
  ],
}

