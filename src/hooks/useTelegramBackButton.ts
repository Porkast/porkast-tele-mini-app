import { useEffect } from "react";

export const useTelegramBackButton = (onBack?: () => void) => {
    useEffect(() => {
        const webApp = window.Telegram?.WebApp;
        if (!webApp) return;

        // 显示返回按钮
        webApp.BackButton.show();

        const handlePopState = () => {
            // 页面返回时重新显示返回按钮
            webApp.BackButton.show();
        };

        // 监听 popstate 事件（浏览器/Telegram 返回按钮）
        window.addEventListener('popstate', handlePopState);

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
            window.removeEventListener('popstate', handlePopState);
        };
    }, [onBack]);
};
