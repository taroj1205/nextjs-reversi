import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Box, ColorModeScript } from "@yamada-ui/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Reversi",
	description: "Reversi game by taroj1205",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers>
					<ColorModeScript
						type="cookie"
						nonce="testing"
						initialColorMode={"system"}
					/>
					<Box className="min-h-[100svh] flex flex-col items-center justify-center">
						{children}
					</Box>
				</Providers>
			</body>
		</html>
	);
}
