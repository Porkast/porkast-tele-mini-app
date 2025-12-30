import { useEffect } from "react";

export const useTelegramBackButton = (onBack?: () => void) => {
    useEffect(() => {
        const webApp = window.Telegram?.WebApp;
        if (!webApp) return;

        webApp.BackButton.show();

        webApp.BackButton.onClick(() => {
            if (onBack) {
                onBack();
            } else {
                webApp.BackButton.hide();
                window.history.back();
            }
        });

        return () => {
            webApp.BackButton.hide();
            webApp.BackButton.offClick(() => {});
        };
    }, [onBack]);
};
