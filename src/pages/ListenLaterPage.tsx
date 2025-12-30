import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTelegramUserInfo, getUserInfoByTelegramUserId, type ServerUserInfo } from '../libs/User';
import { getListenLaterListByUserId } from '../libs/ListenLater';
import { AppProvider } from '../component/AppContext';
import EpisodeCard from '../component/EpisodeCard';
import Footer from '../component/Footer';
import type { UserListenLaterDto } from '../types/ListenLater';
import { AvatarImage } from '../component/PorkastImage';
import SubscribeListenLaterBtn from '../component/SubscribeListenLaterButton';

export default function ListenLaterPage() {
    const { teleUserId } = useParams<{ teleUserId: string }>();
    const searchParams = new URLSearchParams(window.location.search);
    const page = searchParams.get('page') || '1'

    const [pageUserId, setPageUserId] = useState("");
    const [totalPage, setTotalPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [nickname, setNickname] = useState("")
    const [nextPageUrl, setNextPageUrl] = useState("")
    const [prevPageUrl, setPrevPageUrl] = useState("")
    const [isNextBtnClickable, setIsNextBtnClickable] = useState(true)
    const [isPreBtnClickable, setIsPreBtnClickable] = useState(true)
    const [itemList, setItemList] = useState<UserListenLaterDto[]>([])
    const [userInfo, setUserInfo] = useState<ServerUserInfo>()
    const [isMyPage, setIsMyPage] = useState(false)

    useEffect(() => {
        async function initPageInfo() {
            window.scrollTo(0, 0)
            const teleUserInfo = getTelegramUserInfo()
            const userInfoResp = await getUserInfoByTelegramUserId(teleUserInfo.id.toString())
            if (userInfoResp.code != 0) {
                return
            }
            const userInfoData = userInfoResp.data
            const nicknameStr = userInfoData.nickname || userInfoData.email.split('@')[0]
            setUserInfo(userInfoData)
            setNickname(nicknameStr)
            setPageUserId(userInfoData.userId)

            const resp = await getListenLaterListByUserId(userInfoData.userId, parseInt(page))
            const itemDataList = resp.data
            setItemList(itemDataList)
            if (itemDataList && itemDataList.length > 0) {
                setTotalPage(Math.ceil(itemDataList[0].count / 10))
                setTotalCount(itemDataList[0].count)
            } else {
                setTotalPage(1)
                setTotalCount(0)
            }
        }

        initPageInfo()
    }, [page])

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
        setNextPageUrl(`/listenlater/${teleUserId}?page=` + nextPage)

        let prePage = 0
        if (parseInt(page) > 1) {
            prePage = parseInt(page) - 1
        } else {
            prePage = parseInt(page)
        }
        setPrevPageUrl(`/listenlater/${teleUserId}?page=` + prePage)

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
    }, [totalCount, totalPage, page, teleUserId])

    return (
        <AppProvider>
            <div>
                <div className="w-full flex justify-center mb-9 min-h-screen pt-20">
                    <div className='w-full max-w-2xl pl-6 pr-6'>
                        <div className="w-full mb-10">
                            <div className="flex justify-start mt-4">
                                <AvatarImage className="w-28" imageUrl={userInfo?.avatar} />
                                <div className="ml-3">
                                    <div className="md:text-2xl text-xl font-bold">{nickname} ListenLater</div>
                                    {
                                        isMyPage ? (
                                            <div className="mt-4 -ml-2 flex justify-start">
                                                <SubscribeListenLaterBtn creatorId={userInfo?.userId || ""}  />
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
                            itemList.map((item) => {
                                return (
                                    <EpisodeCard key={item.id} data={{
                                        itemId: item.guid,
                                        channelId: item.feed_id,
                                        title: item.title,
                                        description: item.text_description || item.description,
                                        image: item.image_url,
                                        link: item.link,
                                        rssLink: item.feed_link,
                                        channelName: item.channel_title,
                                        authorName: item.author,
                                        pubDate: item.pub_date,
                                        audioLength: item.duration,
                                        audioSrc: item.enclosure_url,
                                        hideListenLaterBtn: true
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
