import { useEffect } from "react";

export const useTelegramBackButton = (onBack?: () => void) => {
    useEffect(() => {
        const webApp = window.Telegram?.WebApp;
        if (!webApp) return;

        // Always show the back button when this page mounts
        webApp.BackButton.show();

        const handleBack = () => {
            if (onBack) {
                onBack();
            } else {
                window.history.back();
            }
        };

        webApp.BackButton.onClick(handleBack);

        return () => {
            // Remove the specific listener we added
            webApp.BackButton.offClick(handleBack);
            // Always hide the back button when unmounting
            // The next page will show it again if it uses this hook
            webApp.BackButton.hide();
        };
    }, [onBack]);
};
