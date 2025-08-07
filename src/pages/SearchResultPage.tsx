import { Link, useLocation } from "react-router-dom"
import { searchPodcastEpisodeFromItunes } from "../libs/Itunes"
import { useEffect, useRef, useState } from "react"
import type { FeedItem } from "../types/FeedItem"
import { AppProvider } from "../component/AppContext"
import AddExcludeFeedIdDialog, { type AddExcludeFeedIdDialogRef } from "../component/AddExcludeFeedIdDialog"
import EpisodeCard from "../component/EpisodeCard"
import Loading from "../component/Loading"
import type { SubscribeKeywrodDialogRef } from "../component/SubscribeKeywrodDialog"
import SubscribeKeywrodDialog from "../component/SubscribeKeywrodDialog"
import Footer from "../component/Footer"

const Page = {
    NextPage: 'NextPage',
    PrePage: 'PrePage'
} as const

type Page = 'NextPage' | 'PrePage'


export default function SearchResultPage() {

    const [searchResultData, setSearchResultData] = useState<FeedItem[]>([])
    const [searchResultCount, setSearchResultCount] = useState(0)
    const [searchResultTotalPage, setSearchResultTotalPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [isPreBtnClickable, setIsPreBtnClickable] = useState(true)
    const [isNextBtnClickable, setIsNextBtnClickable] = useState(true)
    const addExcludeFeedIdDialogRef = useRef<AddExcludeFeedIdDialogRef>(null)
    const subscribeSearchKeywordDialogRef = useRef<SubscribeKeywrodDialogRef>(null)

    const localtion = useLocation()
    const searchParams = new URLSearchParams(localtion.search)
    const searchTotalCount = 200
    const queryKeyword = searchParams.get('q')
    const excludeFeedId = searchParams.get('excludeFeedId')
    let page = searchParams.get('page') || '1'
    let entity = searchParams.get('scope')
    if (!entity) {
        entity = "item"
    }
    let country = searchParams.get('country') || 'US'
    let source = searchParams.get('source') || 'itunes'
    const limit = 10

    const prevPageUrl = getTargetPageUrl(queryKeyword || '', parseInt(page), searchResultTotalPage, Page.PrePage)
    const nextPageUrl = getTargetPageUrl(queryKeyword || '', parseInt(page), searchResultTotalPage, Page.NextPage)

    const showExcludeDialog = (channelTitle: string, feedId: string) => {
        addExcludeFeedIdDialogRef.current?.showModal(channelTitle, feedId)
    }

    const showSubscribeSearchKeywordDialog = () => {
        subscribeSearchKeywordDialogRef.current?.showDialog(queryKeyword || '', excludeFeedId || '', country, source)
    }

    useEffect(() => {
        const fetchSearchData = async () => {
            setIsLoading(true)
            const offest = (parseInt(page || '1') - 1) * limit
            const data = await searchPodcastEpisodeFromItunes(queryKeyword || '', 'podcastEpisode', country || 'US', excludeFeedId || '', offest, limit, searchTotalCount)
            setSearchResultData(data)
            setIsLoading(false)
            if (data.length > 0) {
                const totalCount = data[0].Count
                setSearchResultCount(totalCount)
                const totalPage = Math.ceil(totalCount / limit)
                setSearchResultTotalPage(totalPage)
            } else {
                setSearchResultCount(0)
            }
        }
        fetchSearchData()
    }, [queryKeyword, excludeFeedId, page, entity, country])

    useEffect(() => {
        if (parseInt(page) >= searchResultTotalPage) {
            setIsNextBtnClickable(false)
        } else {
            setIsNextBtnClickable(true)
        }
        if (parseInt(page) <= 1) {
            setIsPreBtnClickable(false)
        } else {
            setIsPreBtnClickable(true)
        }
    }, [page, searchResultCount])

    return (
        <AppProvider>
            <div className="w-full">
                <div className="w-full flex justify-center pl-6 pr-6 pt-20">
                    <div className="w-full max-w-2xl">
                        <div className='text-neutral-500 text-sm mb-6 ml-2'>{searchResultCount} results</div>
                        {
                            isLoading ? (
                                <Loading />
                            ) : (
                                <>
                                    {
                                        searchResultData?.map((item: FeedItem) => {
                                            return (
                                                <EpisodeCard key={item.Id} data={{
                                                    itemId: item.GUID,
                                                    channelId: item.ChannelId,
                                                    title: item.HighlightTitle,
                                                    description: item.TextDescription,
                                                    image: item.ImageUrl,
                                                    link: item.Link,
                                                    rssLink: item.FeedLink,
                                                    channelName: item.HighlightChannelTitle,
                                                    authorName: item.Author,
                                                    pubDate: item.PubDate,
                                                    audioLength: item.Duration,
                                                    audioSrc: item.EnclosureUrl,
                                                    showExcludeBtn: true
                                                }}
                                                    onExcludeModalBtnClick={showExcludeDialog}
                                                />
                                            )
                                        })
                                    }
                                </>
                            )
                        }
                        <div className='flex justify-start w-full'>
                            <button className="btn btn-primary rounded-lg ml-4" onClick={showSubscribeSearchKeywordDialog}>
                                <span className="font-bold text-base">Subscribe {queryKeyword}</span>
                            </button>
                        </div>
                    </div>
                </div>
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
                <AddExcludeFeedIdDialog ref={addExcludeFeedIdDialogRef} />
                <SubscribeKeywrodDialog ref={subscribeSearchKeywordDialogRef} />
                <Footer />
            </div>
        </AppProvider>
    )
}

const getTargetPageUrl = (keyword: string, currentPage: number, searchResultTotalPage: number, target: Page): string => {
    const urlParams = new URLSearchParams(window.location.search);
    var targetPageUrl = '';
    var targetPageNum = 0;
    var entity = urlParams.get('entity') ? urlParams.get('entity') : 'item';
    var country = urlParams.get('country') ? urlParams.get('country') : 'US';
    var excludeFeedId = urlParams.get('excludeFeedId') ? urlParams.get('excludeFeedId') : '';

    if (target == Page.NextPage) {
        targetPageNum = currentPage >= searchResultTotalPage ? currentPage : currentPage + 1
    } else {
        targetPageNum = currentPage > 1 ? currentPage - 1 : currentPage
    }
    targetPageUrl = "/search?q=" + keyword + "&page=" + targetPageNum + "&entity=" + entity + "&country=" + country + "&excludeFeedId=" + excludeFeedId

    return targetPageUrl
}