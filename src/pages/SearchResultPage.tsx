import { useLocation } from "react-router-dom"
import { searchPodcastEpisodeFromItunes } from "../libs/Itunes"
import { useEffect, useState } from "react"
import type { FeedItem } from "../types/FeedItem"


export default function SearchResultPage() {

    const [searchResultData, setSearchResultData] = useState<FeedItem[]>([])
    const [searchResultCount, setSearchResultCount] = useState(0)
    const [searchResultTotalPage, setSearchResultTotalPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)

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
    const limit = 10


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
    return (
        <>
            {
                isLoading ?
                    <span className="loading loading-bars loading-lg"></span> :
                    <>
                        <div>
                            Search Result for {queryKeyword}
                        </div>
                        <div>
                            Total Result: {searchResultCount}
                        </div>
                        <div>
                            Total Page: {searchResultTotalPage}
                        </div>
                        <div>
                            {searchResultData.map((item, index) => {
                                return (
                                    <div key={index}>
                                        {item.Title}
                                    </div>
                                )
                            })}
                        </div>
                    </>
            }
        </>
    )
}