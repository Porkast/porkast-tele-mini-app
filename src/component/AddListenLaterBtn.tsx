import { addToListenLater } from "../libs/ListenLater";
import type { UserInfo } from "../types/UserInfo";
import { useAppContext } from "./AppContext";
import { MsgAlertType } from "./MsgAlert";
import { useEffect, useState } from "react";

type AddListenLaterButtonProps = {
    userId?: string;
    itemId: string;
    channelId: string;
}

export default function AddListenLaterButton(props: AddListenLaterButtonProps) {

    const { userId, itemId, channelId } = props
    const [currentUserId, setCurrentUserId] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const appContext = useAppContext()
    useEffect(() => {
        const getUserInfo = async () => {
            const usefInfo: UserInfo = {
                userId: '',
                email: '',
                token: '',
                username: '',
                avatar: ''
            }
            if (userId) {
                setCurrentUserId(userId)
            } else {
                setCurrentUserId(usefInfo.userId)
            }
        }
        getUserInfo()
    }, [userId, itemId, channelId])



    const onAddListenLaterBtnClick = async () => {
        if (isLoading) {
            return
        }
        setIsLoading(true)
        if (currentUserId == '') {
            appContext.showMsgAlert('Please login first', MsgAlertType.FAILED)
            return
        }

        const resp = await addToListenLater(channelId, itemId, currentUserId, "itunes").finally(() => {
            setIsLoading(false)
        })
        if (resp.code === 0) {
            appContext.showMsgAlert('Done', MsgAlertType.SUCCESS)
        } else {
            appContext.showMsgAlert(resp.message, MsgAlertType.FAILED)
        }
        setIsLoading(false)
    }

    return (
        <>
            <button className="btn btn-neutral btn-sm flex items-center rounded-lg mr-2" onClick={onAddListenLaterBtnClick}>
                {
                    isLoading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        <svg className="w-4 h-4 fill-accent-content" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
                            <path fill="currentColor" d="M13 7h-2v6l4.2 2.5.8-1.2-3.5-2.1z" />
                        </svg>
                    )
                }
                <span className="font-bold text-xs md:display">Listen Later</span>
            </button>
        </>
    )
}