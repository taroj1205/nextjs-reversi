"use client";
import {
	ColorModeScript,
	UIProvider,
	createColorModeManager,
} from "@yamada-ui/react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	const colorModeManager = createColorModeManager("cookie");
	return (
		<UIProvider colorModeManager={colorModeManager}>
			{children}
		</UIProvider>
	);
};
