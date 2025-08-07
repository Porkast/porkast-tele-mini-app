
export type ServerUserInfo = {
    id: string;
    username?: string;
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
    const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username
    }
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


    const resp = await fetch(``, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': userInfo.token || ''
        },
        body: JSON.stringify(
            {
                userId: userInfo.id,
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

export const getUserInfoFromServer = async (userId: string): Promise<{ code: number, message: string, data: ServerUserInfo }> => {
    const resp = await fetch(`api/user/info/${userId}`)
    const respJson = await resp.json()

    return {
        code: respJson.code,
        message: respJson.message,
        data: respJson.data
    }
}