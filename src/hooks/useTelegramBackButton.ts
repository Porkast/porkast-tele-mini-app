import { useEffect, useRef } from "react";

export const useTelegramBackButton = (onBack?: () => void) => {
    const isNavigatingBack = useRef(false);

    useEffect(() => {
        const webApp = window.Telegram?.WebApp;
        if (!webApp) return;

        // Always show the back button when this page mounts
        webApp.BackButton.show();

        const handlePopState = () => {
            // Mark that we're navigating back, so cleanup won't hide the button
            isNavigatingBack.current = true;
        };

        // Listen for popstate (browser/Telegram back button)
        window.addEventListener('popstate', handlePopState);

        webApp.BackButton.onClick(() => {
            isNavigatingBack.current = true;
            if (onBack) {
                onBack();
            } else {
                webApp.BackButton.hide();
                window.history.back();
            }
        });

        return () => {
            // Only hide the back button if we're NOT navigating back
            // This preserves the button state when returning to this page
            if (!isNavigatingBack.current) {
                webApp.BackButton.hide();
            }
            webApp.BackButton.offClick(() => {});
            window.removeEventListener('popstate', handlePopState);
        };
    }, [onBack]);
};
