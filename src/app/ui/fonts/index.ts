import { Geist, Geist_Mono, Sacramento } from 'next/font/google'
import localFont from 'next/font/local'

export const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
	display: "swap"
});

export const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	display: "swap"
});

export const sacramento = Sacramento({
	variable: "--font-sacramento",
	subsets: ["latin"],
	weight: "400",
	display: "swap"
});

export const eUkrainehead = localFont({
	src: "./e-ukrainehead-regular_w.woff",
	variable: "--font-eukrainehead",
	weight: "100",
	display: "swap",
});
export const eUkraine = localFont({
	src: "./e-ukraine-regular.woff",
	variable: "--font-eukraine",
	weight: "100 900",
	display: "swap",
});
export const manrope = localFont({
	src: "./Manrope-Regular.woff",
	variable: "--font-manrope",
	weight: "100 900",
	display: "swap",
});
