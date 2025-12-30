import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTelegramUserInfo, getUserInfoByTelegramUserId, type ServerUserInfo } from "../../libs/User";
import { getUserPlaylistByUserId } from "../../libs/Playlist";
import { AppProvider } from "../../component/AppContext";
import { AvatarImage } from "../../component/PorkastImage";
import Footer from "../../component/Footer";
import type { UserPlaylistDto } from "../../types/Playlist";
import { formatDateTime } from "../../libs/Common";
import parse from 'html-react-parser';

export default function PlayListPage() {
    const { teleUserId } = useParams<{ teleUserId: string }>();
    const searchParams = new URLSearchParams(window.location.search);
    const page = searchParams.get('page') || '1'

    const [totalPage, setTotalPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [nickname, setNickname] = useState("")
    const [nextPageUrl, setNextPageUrl] = useState("")
    const [prevPageUrl, setPrevPageUrl] = useState("")
    const [isNextBtnClickable, setIsNextBtnClickable] = useState(true)
    const [isPreBtnClickable, setIsPreBtnClickable] = useState(true)
    const [playlists, setPlaylists] = useState<UserPlaylistDto[]>([])
    const [userInfo, setUserInfo] = useState<ServerUserInfo>()

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
            let tempUserId = ''
            setUserInfo(userInfoData)
            setNickname(nicknameStr)

            if (teleUserId === teleUserInfo.id.toString()) {
                tempUserId = userInfoData.userId
            } else {
                const pageUserInfoResp = await getUserInfoByTelegramUserId(teleUserId || "")
                if (pageUserInfoResp.code != 0) {
                    return
                }
                tempUserId = pageUserInfoResp.data.userId
                setNickname(pageUserInfoResp.data.nickname || pageUserInfoResp.data.email.split('@')[0])
            }

            const resp = await getUserPlaylistByUserId(tempUserId, parseInt(page))
            const playListsData = resp.data
            setPlaylists(playListsData)
            if (playListsData && playListsData.length > 0) {
                setTotalPage(Math.ceil(playListsData[0].Count / 10))
                setTotalCount(playListsData[0].Count)
            } else {
                setTotalPage(1)
                setTotalCount(0)
            }
        }

        initPageInfo()
    }, [page, teleUserId])

    useEffect(() => {
        let nextPage = 0
        if (parseInt(page) >= totalPage) {
            nextPage = parseInt(page)
        } else {
            nextPage = parseInt(page) + 1
        }
        setNextPageUrl(`/playlist/${teleUserId}?page=` + nextPage)

        let prePage = 0
        if (parseInt(page) > 1) {
            prePage = parseInt(page) - 1
        } else {
            prePage = parseInt(page)
        }
        setPrevPageUrl(`/playlist/${teleUserId}?page=` + prePage)

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
                        <div className="flex justify-center mt-4">
                            <div className="w-full">
                                <div className="flex justify-center">
                                    <AvatarImage className="w-28" imageUrl={userInfo?.avatar} />
                                </div>
                                <div className="flex justify-center mt-4">
                                    <div className="md:text-2xl text-xl font-bold">{nickname}{`'s Porkast Playlist`}</div>
                                </div>
                                <div className="flex justify-center mt-4">
                                    <div className="mt-4 text-sm text-gray-500">{nickname}@Porkast</div>
                                </div>
                            </div>
                        </div>
                        <div className='text-neutral-500 text-sm mb-6 ml-2'>{totalCount} playlist</div>
                        {
                            playlists?.map((item, index) => {
                                return (
                                    <div key={index} className="card w-full bg-base-100 shadow-xl mb-6">
                                        <div className="card-body">
                                            <h2 className="card-title w-full flex justify-start">
                                                <div className='w-4/5 flex justify-start'>
                                                    <Link to={`/playlist/${teleUserId}/${item.Id}`}>{item.PlaylistName}</Link>
                                                </div>
                                            </h2>
                                            <div className="max-h-24 flex overflow-clip mt-2 text-sm neutral-content">
                                                <Link to={`/playlist/${teleUserId}/${item.Id}`}>
                                                    <p>{parse(item.Description)}</p>
                                                </Link>
                                            </div>
                                            <p className='mt-4'>Create at: {formatDateTime(item.RegDate?.toLocaleString())}</p>
                                        </div>
                                    </div>
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
