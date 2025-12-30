'use client'

import { subscribeUserListenLater } from "../libs/Subscription";
import { getTelegramUserInfo, getUserInfoByTelegramUserId } from "../libs/User";
import { useAppContext } from "./AppContext";
import { MsgAlertType } from "./MsgAlert";

type SubscribeListenLaterBtnProps = {
    creatorId: string;
}


export default function SubscribeListenLaterBtn(props: SubscribeListenLaterBtnProps) {

    const { creatorId: creatorTeleId } = props
    const appContext = useAppContext()
    const currentTeleUserInfo = getTelegramUserInfo();
    const currentTeleUserId = currentTeleUserInfo.id.toString();

    const onSubscribeListenlaterBtnClick = async () => {
        if (creatorTeleId == currentTeleUserId) {
            appContext.showMsgAlert('This is your Listen Later', MsgAlertType.WARN)
            return
        }
        const currentUserInfo = await getUserInfoByTelegramUserId(currentTeleUserId)
        const creatorUserInfo = await getUserInfoByTelegramUserId(creatorTeleId)
        const resp = await subscribeUserListenLater(currentUserInfo.data.userId, creatorUserInfo.data.userId, "")
        if (resp.code === 0) {
            appContext.showMsgAlert('Subscribed Success', MsgAlertType.SUCCESS)
        } else {
            appContext.showMsgAlert('Subscribed Failed : ' + resp.message, MsgAlertType.FAILED)
        }
    }

    return (
        <>
            <button className="btn btn-neutral ml-2 btn-sm flex items-center rounded-lg" onClick={onSubscribeListenlaterBtnClick}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /><path fill="none" d="M0 0h24v24H0z" /></svg>
                <span className="font-bold text-xs md:display">Subscribe</span>
            </button>
        </>
    )
}