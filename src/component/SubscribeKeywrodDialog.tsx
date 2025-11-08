import { type Ref, forwardRef, useEffect, useState } from "react"
import { useAppContext } from "./AppContext"
import { MsgAlertType } from "./MsgAlert"
import { getPodcastInfo } from "../libs/Itunes"
import type { FeedChannel } from "../types/FeedChannel"
import type { UserInfo } from "../types/UserInfo"
import { subscribeSearchKeyword } from "../libs/Subscription"


export type SubscribeKeywrodDialogRef = {
    showDialog: (keyword: string, excludeFeedIds: string, country: string, source: string) => void
}

const SubscribeKeywrodDialog = forwardRef<SubscribeKeywrodDialogRef>((props, ref: Ref<SubscribeKeywrodDialogRef>) => {

    const [excludeTitleList, setExcludeTitleList] = useState<string[]>([])
    const [excludeFeedIdList, setExcludeFeedIdList] = useState<string[]>([])
    const [excludeFeedIdStr, setExcludeFeedIdStr] = useState<string>("")
    const [searchKeywrod, setSearchKeywrod] = useState<string>("")
    const [country, setCountry] = useState<string>("US")
    const [source, setSource] = useState<string>("itunes")
    const [isLoadingExcludeChannelInfo, setIsLoadingExcludeChannelInfo] = useState(false)
    const [isSubscribeLoading, setIsSubscribeLoading] = useState(false)
    const appContext = useAppContext()

    useEffect(() => {
        const dialog = document.getElementById('search_keyword_modal') as HTMLDialogElement;
        if (ref) {
            (ref as any).current = {
                showDialog: (keyword: string, excludeFeedIds: string, country: string, source: string) => {
                    if (dialog) {
                        dialog.showModal();
                        setSearchKeywrod(keyword)
                        setExcludeFeedIdStr(excludeFeedIds)
                        setCountry(country)
                        setSource(source)
                        if (excludeFeedIds) {
                            const excludeFeedIdListTemp = excludeFeedIds.split(",")
                            setExcludeFeedIdList(excludeFeedIdListTemp)
                            getExcludeChannelInfo(excludeFeedIdListTemp)
                        }
                    }
                }
            }
        }

    }, [])

    const getExcludeChannelInfo = async (feedIdList: string[]) => {
        const channelNameListTemp: string[] = []
        if (feedIdList.length > 0) {
            setIsLoadingExcludeChannelInfo(true)
        }

        const promiseList = feedIdList.map(feedId => getPodcastInfo(feedId))

        let channelInfoList: FeedChannel[] = []
        try {
            channelInfoList = await Promise.all(promiseList)
        } catch (error) {
            console.log('getPodcastInfo error : ', error)
        }

        for (const channelInfo of channelInfoList) {
            channelNameListTemp.push(channelInfo.Title)
        }
        setExcludeTitleList(channelNameListTemp)
        setIsLoadingExcludeChannelInfo(false)
    }

    const doSubscribeSearchKeyword = async () => {
        if (isSubscribeLoading) {
            return
        }
        setIsSubscribeLoading(true)
        const userInfo: UserInfo = {
            userId: '',
            email: '',
            token: '',
            username: '',
            avatar: ''
        }
        const respJson = await subscribeSearchKeyword(userInfo.userId, searchKeywrod, country, source, excludeFeedIdStr, userInfo?.token).finally(() => {
            setIsSubscribeLoading(false)
        })
        if (respJson.code === 0) {
            appContext.showMsgAlert('Done', MsgAlertType.SUCCESS)
        } else {
            appContext.showMsgAlert(respJson.message, MsgAlertType.FAILED)
        }
        setIsSubscribeLoading(false)
        const dialog = document.getElementById('search_keyword_modal') as HTMLDialogElement;
        dialog.close()
    }


    return (
        <>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="search_keyword_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Subscribe search list of `{searchKeywrod}`</h3>
                    {
                        excludeFeedIdList && excludeFeedIdList.length > 0 ? (
                            <div className="mt-4">
                                <p className="text-gray-500">Excluded podcast from search list</p>
                                {
                                    isLoadingExcludeChannelInfo ? (
                                        <div className="flex justify-center w-full mt-2">
                                            <span className="loading loading-dots loading-md"></span>
                                        </div>
                                    ) : (
                                        <div className="mt-2">
                                            {
                                                excludeTitleList.map((title, index) => {
                                                    return <div className="btn mr-2 mb-2" key={index}>{title}</div>
                                                })
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        ) : (
                            <div className="mt-4"><p>No excluded podcast</p></div>
                        )
                    }
                    <p className="mt-4 text-gray-500">You will be notified of any updates to the search results. Stay tuned for the latest content!</p>
                    <div className="modal-action">
                        {
                            isSubscribeLoading ? (
                                <button className="btn"><span className="loading loading-spinner loading-md"></span></button>
                            ) : (
                                <button className="btn" onClick={doSubscribeSearchKeyword}>Yay</button>
                            )
                        }
                        {/* if there is a button in form, it will close the modal */}
                        {/* <form method="dialog">
                        </form> */}
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
})

SubscribeKeywrodDialog.displayName = 'SubscribeKeywrodDialog'

export default SubscribeKeywrodDialog;