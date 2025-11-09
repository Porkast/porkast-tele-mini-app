import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTelegramUserInfo, getUserInfoByTelegramUserId, type ServerUserInfo } from '../../libs/User';
import type { FeedItem } from '../../types/FeedItem';
import { AppProvider } from '../../component/AppContext';
import { AvatarImage } from '../../component/PorkastImage';
import EpisodeCard from '../../component/EpisodeCard';
import Footer from '../../component/Footer';
import { ShareSearchSubscriptionBtn } from '../../component/Share';
import UnsubscribeKeywordButton from '../../component/UnsubscribeKeywordButton';
import SubscribeListenLaterBtn from '../../component/SubscribeListenLaterButton';
import { getUserKeywordSubscriptionItemList } from '../../libs/Subscription';

export default function SubscriptionKeywordListPage() {
    const { teleUserId, keyword } = useParams<{ teleUserId: string; keyword: string }>();
    const searchParams = new URLSearchParams(window.location.search);
    const page = searchParams.get('page') || '1'

    const [pageUserId, setPageUserId] = useState("");
    const [totalPage, setTotalPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [userInfo, setUserInfo] = useState<ServerUserInfo>()
    const [nickname, setNickname] = useState("")
    const [isMyPage, setIsMyPage] = useState(false)
    const [nextPageUrl, setNextPageUrl] = useState("")
    const [prevPageUrl, setPrevPageUrl] = useState("")
    const [isNextBtnClickable, setIsNextBtnClickable] = useState(true)
    const [isPreBtnClickable, setIsPreBtnClickable] = useState(true)
    const [itemList, setItemList] = useState<FeedItem[]>([])

    useEffect(() => {
        async function initPageInfo() {
            const userInfoResp = await getUserInfoByTelegramUserId(teleUserId || "")
            if (userInfoResp.code != 0) {
                return
            }
            const userInfoData = userInfoResp.data
            const nicknameStr = userInfoData.nickname || userInfoData.email.split('@')[0]
            setUserInfo(userInfoData)
            setNickname(nicknameStr)
            setPageUserId(userInfoData.userId)

            const resp = await getUserKeywordSubscriptionItemList(userInfoData.userId, keyword || "", page)
            const itemDataList = resp.data
            setItemList(itemDataList)
            if (itemDataList && itemDataList.length > 0) {
                setTotalPage(Math.ceil(itemDataList[0].Count / 10))
                setTotalCount(itemDataList[0].Count)
            } else {
                return
            }
        }

        initPageInfo()
    }, [page, teleUserId, keyword])

    useEffect(() => {
        const sessionUser = getTelegramUserInfo()
        if (teleUserId === sessionUser.id.toString()) {
            setIsMyPage(true)
        }
    }, [teleUserId])

    useEffect(() => {
        let nextPage = 0
        if (parseInt(page) >= totalPage) {
            nextPage = parseInt(page)
        } else {
            nextPage = parseInt(page) + 1
        }
        setNextPageUrl("/subscription/" + pageUserId + "/" + keyword + "?page=" + nextPage)

        let prePage = 0
        if (parseInt(page) > 1) {
            prePage = parseInt(page) - 1
        } else {
            prePage = parseInt(page)
        }
        setPrevPageUrl("/subscription/" + pageUserId + "/" + keyword + "?page=" + prePage)

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
    }, [totalCount, totalPage, page, pageUserId, keyword])

    return (
        <AppProvider>
            <div>
                <div className="w-full flex justify-center mb-9 min-h-screen pt-20">
                    <div className='w-full max-w-2xl pl-6 pr-6'>
                        <div className="w-full mb-10">
                            <div className="flex justify-start mt-4">
                                <AvatarImage className="w-28" imageUrl={userInfo?.avatar} />
                                <div className="ml-3">
                                    <div className="md:text-2xl text-xl font-bold">#{keyword}</div>
                                    <div className="text-sm font-medium text-gray-500 mt-2">Search keyword #{keyword} subscription</div>
                                    {
                                        isMyPage ? (
                                            <div className="mt-4 -ml-2 flex justify-start">
                                                <ShareSearchSubscriptionBtn userId={pageUserId || ""} keyword={keyword || ""} />
                                                <UnsubscribeKeywordButton userId={pageUserId || ""} keyword={keyword || ""} />
                                            </div>
                                        ) : (
                                            <div className="mt-4 -ml-2 flex justify-start">
                                                <SubscribeListenLaterBtn creatorId={pageUserId || ""} />
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-gray-500">{nickname}@Porkast</div>
                        </div>
                        <div className='text-neutral-500 text-sm mb-6 ml-2'>{totalCount} results</div>
                        {
                            itemList.map((item, index) => {
                                return (
                                    <EpisodeCard key={index} data={{
                                        itemId: item.GUID,
                                        channelId: item.FeedId,
                                        title: item.Title,
                                        description: item.Description,
                                        image: item.ImageUrl,
                                        link: item.Link,
                                        rssLink: item.FeedLink,
                                        channelName: item.ChannelTitle,
                                        authorName: item.Author,
                                        pubDate: item.PubDate,
                                        // audioLength: convertMillsTimeToDuration(parseInt(item.Duration)),
                                        audioLength: item.Duration,
                                        audioSrc: item.EnclosureUrl
                                    }} />
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
                    </div>
                </div>

                <Footer />
            </div>
        </AppProvider>
    )
}