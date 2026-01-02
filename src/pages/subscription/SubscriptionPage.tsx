import { useEffect, useState } from "react"
import { AvatarImage } from "../../component/PorkastImage"
import { getTelegramUserInfo, getUserInfoByTelegramUserId, type ServerUserInfo } from "../../libs/User"
import type { SubscriptionDataDto } from "../../types/Subscription"
import { Link, Outlet } from "react-router-dom"
import { getUserSubscriptionList } from "../../libs/Subscription"
import { formatDateTime } from "../../libs/Common"

export default function SubscriptionPage() {

    const searchParams = new URLSearchParams(window.location.search)
    const page = searchParams.get('page') || '1'

    const teleUserinfo = getTelegramUserInfo()
    const teleUserId = teleUserinfo.id
    const nickname = teleUserinfo.first_name

    const [subscriptionList, setSubscriptionList] = useState<SubscriptionDataDto[]>([])
    const [totalPage, setTotalPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [userInfo, setUserInfo] = useState<ServerUserInfo>()
    const [nextPageUrl, setNextPageUrl] = useState("")
    const [prevPageUrl, setPrevPageUrl] = useState("")
    const [isNextBtnClickable, setIsNextBtnClickable] = useState(true)
    const [isPreBtnClickable, setIsPreBtnClickable] = useState(true)

    useEffect(() => {
        async function initPageInfo() {
            window.scrollTo(0, 0)
            const userInfoResp = await getUserInfoByTelegramUserId(teleUserId.toString())
            setUserInfo(userInfoResp.data)
            var subscriptionDataList: SubscriptionDataDto[] = []
            const subscriptionResp = await getUserSubscriptionList(userInfoResp.data.userId)
            subscriptionDataList = subscriptionResp.data
            setSubscriptionList(subscriptionDataList)
            if (subscriptionDataList && subscriptionDataList.length > 0) {
                setTotalPage(Math.ceil(subscriptionDataList[0].Count / 10))
                setTotalCount(subscriptionDataList[0].Count)
            } else {
                return
            }
        }

        initPageInfo()
    }, [page])

    useEffect(() => {
        let nextPage = 0
        if (parseInt(page) >= totalPage) {
            nextPage = parseInt(page)
        } else {
            nextPage = parseInt(page) + 1
        }
        setNextPageUrl("/subscription/" + userInfo?.telegramId + "/" + "?page=" + nextPage)

        let prePage = 0
        if (parseInt(page) > 1) {
            prePage = parseInt(page) - 1
        } else {
            prePage = parseInt(page)
        }
        setPrevPageUrl("/subscription/" + userInfo?.telegramId + "/" + "?page=" + prePage)

        if (parseInt(page) >= totalPage) {
            setIsNextBtnClickable(false)
        } else {
            setIsNextBtnClickable(true)
        }
        if (parseInt(page) <= 1) {
            setIsPreBtnClickable(false)
        } else {
            setIsPreBtnClickable(true)
        }
    }, [totalCount, totalPage, page])

    return (
        <>
            <div className='w-full flex justify-center mb-9 min-h-screen pt-20'>
                <div className='w-full max-w-2xl pl-6 pr-6 mb-9'>
                    <div className="w-full mb-10">
                        <div className="flex justify-center mt-4">
                            <div className="w-full">
                                <div className="flex justify-center">
                                    <AvatarImage className="w-28" imageUrl={userInfo?.avatar} />
                                </div>
                                <div className="flex justify-center mt-4">
                                    <div className="md:text-2xl text-xl font-bold">{nickname}{`'s Subscription`}</div>
                                </div>
                                <div className="flex justify-center mt-4">
                                    <div className="mt-4 text-sm text-gray-500">{nickname}@Porkast</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='text-neutral-500 text-sm mb-6 ml-2'>{totalCount} results</div>
                    {
                        subscriptionList?.map((item, index) => {
                            const encodeKeyword = encodeURIComponent(item.Keyword)
                            return (
                                <a key={index} href={`/subscription/${userInfo?.telegramId}/${encodeKeyword}`} className="card w-full bg-base-100 shadow-xl mb-6">
                                    <div className="card-body">
                                        {
                                            item.Keyword ? (
                                                <h2 className="card-title">#{item.Keyword}</h2>
                                            ) : (
                                                <h2 className="card-title">{item.RefName}</h2>
                                            )
                                        }
                                        <div className="md:flex block md:justify-start">
                                            {
                                                item.UpdateTime != null ? (
                                                    <div className="mr-4 md:mb-0 mb-4">Update at: {formatDateTime(item.UpdateTime.toLocaleString())}</div>
                                                ) : (
                                                    <div>Create at: {formatDateTime(item.CreateTime?.toLocaleString())}</div>
                                                )
                                            }
                                            {
                                                item.TotalCount == 0 ? (
                                                    <div></div>
                                                ) : (
                                                    <p>Episodes: {item.TotalCount}</p>
                                                )
                                            }
                                        </div>
                                    </div>
                                </a>
                            )
                        })
                    }
                    <div className="w-full flex justify-center pt-6 pb-9">
                        <div className="join">
                            {
                                isPreBtnClickable ? (
                                    <Link className="join-item btn btn-neutral" to={prevPageUrl}>«</Link>
                                ) : (
                                    <button className="join-item btn btn-neutral btn-disabled">«</button>
                                )
                            }
                            <button className="join-item btn btn-neutral">Page {page}</button>
                            {
                                isNextBtnClickable ? (
                                    <Link className="join-item btn btn-neutral" to={nextPageUrl}>»</Link>
                                ) : (
                                    <button className="join-item btn btn-neutral btn-disabled">»</button>
                                )
                            }
                        </div>
                    </div>
                    <Outlet />
                </div>
            </div>
        </>
    )
}
