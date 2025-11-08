import { API_URL } from "./Constants";

export type ServerUserInfo = {
    userId: string;
    telegramId: string,
    nickname?: string;
    token?: string;
    password?: string;
    email: string;
    phone?: string;
    regDate?: Date;
    updateDate?: Date;
    avatar?: string;
}

export type TelegramUser = {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
}

declare global {
    interface Window {
        Telegram: {
            WebApp: any;
        };
    }
}

export const getTelegramUserInfo = (): TelegramUser => {
    const webApp = window.Telegram.WebApp;
    webApp.ready(); 
    webApp.expand();
    const user = webApp?.initDataUnsafe?.user;
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username
    }
}

export const getDevTelegramUserInfo = (): TelegramUser => {
    const user: TelegramUser = {
        id: import.meta.env.VITE_DEV_TELEGRAM_ID,
        first_name: import.meta.env.VITE_DEV_TELEGRAM_FIRST_NAME,
        last_name: import.meta.env.VITE_DEV_TELEGRAM_LAST_NAME,
        username: import.meta.env.VITE_DEV_TELEGRAM_USERNAME
    }

    return user
}

export const getTempNickname = (serverUserInfo: ServerUserInfo): string => {
    let nickname: string = ""
    if (!serverUserInfo.nickname) {
        if (serverUserInfo.email) {
            nickname = serverUserInfo.email.split('@')[0]
        } else if (serverUserInfo.phone) {
            nickname = serverUserInfo.phone
        }
    } else {
        nickname = serverUserInfo.nickname
    }

    return nickname
}

export const getNickname = (email: string, nickname: string): string => {
    if (!nickname) {
        nickname = email.split('@')[0]
    }
    return nickname
}

export const syncToServer = async (userInfo: ServerUserInfo) => {
    const resp = await fetch(`${API_URL}/user/sync`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': userInfo.token || ''
        },
        body: JSON.stringify(
            {
                userId: userInfo.userId,
                email: userInfo.email,
                phone: userInfo.phone,
                nickname: userInfo.nickname,
                password: userInfo.password,
                avatar: userInfo.avatar
            }
        )
    }).then(resp => resp.json()).catch(err => {
        console.log(err);
    });

    return resp
}

export const getUserInfoByTelegramUserId = async (userId: string): Promise<{ code: number, message: string, data: ServerUserInfo }> => {
    const resp = await fetch(`${API_URL}/user/tele_id/${userId}`)
    const respJson = await resp.json()

    return {
        code: respJson.code,
        message: respJson.message,
        data: respJson.data
    }
}