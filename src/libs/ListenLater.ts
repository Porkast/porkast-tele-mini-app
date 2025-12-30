import type { UserListenLaterDto } from "../types/ListenLater";
import type { JsonResponse } from "../types/Response";
import type { UserInfo } from "../types/UserInfo";
import { API_URL } from "./Constants";

export async function addToListenLater(channelId: string, itemId: string, userId: string, source: string): Promise<JsonResponse> {

    const userInfo: UserInfo = {
        userId: '',
        email: '',
        token: '',
        username: '',
        avatar: ''
    };
    const respJson = await fetch(`${API_URL}/listenlater/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': userInfo?.token
        },
        body: JSON.stringify({
            channelId: channelId,
            itemId: itemId,
            userId: userId,
            source: source
        })
    }).then(resp => resp.json()).catch(err => {
        console.log(err);
    });

    return respJson;
}

export const getListenLaterListByUserId = async (userId: string, page: number): Promise<{ code: number, message: string, data: UserListenLaterDto[] }> => {

    const limit = 10
    const offset = (page - 1) * limit
    const apiUrl = `${API_URL}/listenlater/list/${userId}?limit=${limit}&offset=${offset}`
    const resp = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const respJson = await resp.json()
    return {
        code: respJson.code,
        message: respJson.message,
        data: respJson.data
    }
}
