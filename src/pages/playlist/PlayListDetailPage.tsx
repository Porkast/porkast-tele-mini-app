import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTelegramUserInfo, getUserInfoByTelegramUserId, type ServerUserInfo } from "../../libs/User";
import { getPlaylistInfoById, getPlaylistItemListByUserId } from "../../libs/Playlist";
import { AppProvider } from "../../component/AppContext";
import EpisodeCard from "../../component/EpisodeCard";
import Footer from "../../component/Footer";
import { AvatarImage } from "../../component/PorkastImage";
import { SharePlaylistBtn } from "../../component/Share";
import type { FeedItem } from "../../types/FeedItem";
import type { UserPlaylistDto } from "../../types/Playlist";

export default function PlayListDetailPage() {
    const { teleUserId, playlistId } = useParams<{ teleUserId: string; playlistId: string }>();
    const searchParams = new URLSearchParams(window.location.search);
    const page = searchParams.get('page') || '1'

    const [userInfo, setUserInfo] = useState<ServerUserInfo>()
    const [nickname, setNickname] = useState("")
    const [isMyPage, setIsMyPage] = useState(false)
    const [playlistInfo, setPlaylistInfo] = useState<UserPlaylistDto>()
    const [itemList, setItemList] = useState<FeedItem[]>([])
    const [totalPage, setTotalPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [nextPageUrl, setNextPageUrl] = useState("")
    const [prevPageUrl, setPrevPageUrl] = useState("")
    const [isNextBtnClickable, setIsNextBtnClickable] = useState(true)
    const [isPreBtnClickable, setIsPreBtnClickable] = useState(true)

    useEffect(() => {
        async function initPageInfo() {
            window.scrollTo(0, 0)
            const teleUserInfo = getTelegramUserInfo()
            const userInfoResp = await getUserInfoByTelegramUserId(teleUserInfo.id.toString())
            if (userInfoResp.code != 0) {
                return
            }

            const userId = userInfoResp.data.userId
            const data = await getPlaylistItemListByUserId(userId || "", playlistId || "", parseInt(page))
            if (data.code != 0) {
                return
            }
            const itemDataList = data.data
            const nicknameStr = userInfoResp.data.nickname || userInfoResp.data.email.split('@')[0]
            setUserInfo(userInfoResp.data)
            setNickname(nicknameStr)
            setItemList(itemDataList)
            if (itemDataList && itemDataList.length > 0) {
                setTotalCount(itemDataList[0].Count)
                setTotalPage(Math.ceil(itemDataList[0].Count / 10))
            }

            const playlistInfoResp = await getPlaylistInfoById(playlistId || "")
            if (playlistInfoResp.code != 0) {
                return
            }
            setPlaylistInfo(playlistInfoResp.data)

            if (teleUserId === teleUserInfo.id.toString()) {
                setIsMyPage(true)
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
        setNextPageUrl(`/playlist/${teleUserId}/${playlistId}?page=` + nextPage)

        let prePage = 0
        if (parseInt(page) > 1) {
            prePage = parseInt(page) - 1
        } else {
            prePage = parseInt(page)
        }
        setPrevPageUrl(`/playlist/${teleUserId}/${playlistId}?page=` + prePage)

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
    }, [totalCount, totalPage, page, teleUserId, playlistId])

    return (
        <AppProvider>
            <div>
                <div className="w-full flex justify-center mb-9 min-h-screen pt-20">
                    <div className='w-full max-w-2xl pl-6 pr-6'>
                        <div className="w-full mb-10">
                            <div className="flex justify-start mt-4">
                                <AvatarImage className="w-28" imageUrl={userInfo?.avatar} />
                                <div className="ml-3">
                                    <div className="md:text-2xl text-xl font-bold">{playlistInfo?.PlaylistName}</div>
                                    <div className="text-sm font-medium text-gray-500 mt-2">By {nickname}</div>
                                    <div className="mt-4 -ml-2 flex justify-start">
                                        <SharePlaylistBtn userId={teleUserId || ""} playlistId={playlistId || ""} />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-gray-500">{nickname}@Porkast</div>
                        </div>
                        <div className='text-neutral-500 text-sm mb-6 ml-2'>{totalCount} results</div>

                        {
                            itemList && itemList.length > 0 ? (
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
                                            audioLength: item.Duration,
                                            audioSrc: item.EnclosureUrl,
                                            hideAddToPlaylistBtn: isMyPage,
                                            hideListenLaterBtn: isMyPage
                                        }} />
                                    )
                                })
                            ) : (
                                <></>
                            )
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
