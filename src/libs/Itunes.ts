import { convertMillsTimeToDuration, getUserLocale } from "./Common"
import Parser from "rss-parser";
import type { FeedItem } from "../types/FeedItem";
import type { PodcastFeed, PodcastItem } from "../types/Feed";
import type { FeedChannel } from "../types/FeedChannel";

export const searchPodcastEpisodeFromItunes = async (q: string, entity: string, country: string, excludeFeedId: string, offset: number, limit: number, totalCount: number): Promise<FeedItem[]> => {
    const res = await fetch(`https://itunes.apple.com/search?term=${q}&entity=${entity}&media=podcast&country=${country}&limit=${totalCount}`)
    const jsonResp = await res.json()
    var items: FeedItem[] = []
    const excludeFeedIdList = excludeFeedId.split(',')
    const resultCount = jsonResp.resultCount
    const userLocale = getUserLocale()
    for (const resultItem of jsonResp.results) {
        // if the resultItem.collectionId is in excludeFeedIdList, skip
        if (excludeFeedIdList.includes(String(resultItem.collectionId))) {
            continue
        }

        // format pubdate as yy:mm:dd
        const formatedPubDate = new Date(resultItem.releaseDate).toLocaleDateString(userLocale, { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');

        const duration = convertMillsTimeToDuration(resultItem.trackTimeMillis)
        items.push({
            Id: resultItem.episodeGuid,
            ChannelId: resultItem.collectionId,
            Title: resultItem.trackName,
            HighlightTitle: resultItem.trackName,
            Link: resultItem.trackViewUrl,
            PubDate: formatedPubDate,
            Author: resultItem.artistIds.join(', '),
            InputDate: new Date(formatedPubDate),
            ImageUrl: resultItem.artworkUrl160,
            EnclosureUrl: resultItem.episodeUrl,
            EnclosureType: resultItem.episodeFileExtension,
            EnclosureLength: resultItem.trackTimeMillis,
            Duration: duration,
            Episode: "",
            Explicit: "",
            Season: "",
            EpisodeType: "",
            Description: resultItem.description,
            TextDescription: resultItem.description,
            ChannelImageUrl: resultItem.artworkUrl600,
            ChannelTitle: resultItem.collectionName,
            HighlightChannelTitle: resultItem.collectionName,
            FeedLink: resultItem.feedUrl,
            Count: resultCount,
            TookTime: 0,
            HasThumbnail: false,
            FeedId: resultItem.collectionId,
            GUID: resultItem.episodeGuid,
            Source: "itunes",
            ExcludeFeedId: "",
            Country: country
        })
    }

    items.map(item => {
        item.Count = items.length
    })

    // order by pubDate desc
    items.sort((a, b) => {
        return new Date(b.PubDate).getTime() - new Date(a.PubDate).getTime()
    })

    if (limit == 0) {
        return items
    }

    return items.slice(offset, offset + limit)
}

export const getPodcastInfo = async (podcastId: string): Promise<FeedChannel> => {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${podcastId}&entity=podcast`)
    const jsonResp = await res.json()
    const podcastInfo = jsonResp.results[0]
    let channelInfo: FeedChannel = {
        Id: podcastInfo.collectionId,
        Title: podcastInfo.collectionName,
        ChannelDesc: "",
        TextChannelDesc: "",
        ImageUrl: podcastInfo.artworkUrl100,
        Link: podcastInfo.collectionViewUrl,
        FeedLink: podcastInfo.feedUrl,
        FeedType: "",
        Categories: podcastInfo.genres,
        Author: podcastInfo.artistName,
        OwnerName: podcastInfo.artistName,
        OwnerEmail: "",
        Items: [],
        Count: 0,
        Copyright: "",
        Language: "",
        TookTime: 0,
        HasThumbnail: false
    }

    return channelInfo
}

export const getPodcastAllInfo = async (podcastId: string): Promise<{ podcast: FeedChannel, episodes: FeedItem[] }> => {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${podcastId}&entity=podcast`)
    const jsonResp = await res.json()
    const podcastInfo = jsonResp.results[0]
    const feedLink = podcastInfo.feedUrl
    const rssFeed = await parsePodcastRSS(feedLink);

    var episodeList: FeedItem[] = []
    rssFeed.items.forEach(item => {
        episodeList.push(buildFeedItemModel(rssFeed, feedLink, encodeURIComponent(item.guid), podcastId));
    })
    var channelInfo: FeedChannel = buildFeedChannelModel(rssFeed, feedLink, podcastId);
    channelInfo.Items = episodeList

    return {
        podcast: channelInfo,
        episodes: episodeList
    }
}

export const getPodcastEpisodeInfo = async (podcastId: string, episodeId: string): Promise<{ podcast: FeedChannel, episode: FeedItem }> => {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${podcastId}&entity=podcast`)
    const jsonResp = await res.json()
    const podcastInfo = jsonResp.results[0]
    const feedLink = podcastInfo.feedUrl
    const rss = await parsePodcastRSS(feedLink);
    const episodeInfo = buildFeedItemModel(rss, feedLink, episodeId, podcastId);
    var channelInfo: FeedChannel = buildFeedChannelModel(rss, feedLink, podcastId);

    return {
        podcast: channelInfo,
        episode: episodeInfo
    }
}

const buildFeedItemModel = (rssFeed: PodcastFeed & Parser.Output<PodcastItem>, feedLink: string, episodeId: string, podcastId: string): FeedItem => {
    const rssChannelInfo = rssFeed;
    const rssItemList = rssFeed.items
    const targetItem = rssItemList.find(item => {
        if (encodeURIComponent(item.guid) === episodeId || item.guid === episodeId) {
            return true
        }
    })
    // fill episode info with rss data 
    const formatedPubDate = new Date(targetItem?.pubDate || '').toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    var formaedDuration = '';
    // if duration contain : then ignore it 
    const durationStr = String(targetItem?.itunes.duration)
    if (durationStr.includes(':')) {
        formaedDuration = durationStr
    } else {
        const durationInt = parseInt(durationStr || '0')
        formaedDuration = convertMillsTimeToDuration(durationInt)
    }
    var episodeInfo: FeedItem = {
        Id: episodeId,
        ChannelId: podcastId,
        Title: targetItem?.title || '',
        HighlightTitle: targetItem?.title || '',
        Link: targetItem?.link || '',
        PubDate: formatedPubDate,
        Author: rssChannelInfo.itunes?.author || targetItem?.itunesAuthor || rssChannelInfo.author || '',
        InputDate: new Date(targetItem?.pubDate || ''),
        ImageUrl: targetItem?.itunesImage || rssChannelInfo.itunes?.image || rssChannelInfo.imageUrl || '',
        EnclosureUrl: targetItem?.enclosure?.url || '',
        EnclosureType: targetItem?.enclosure?.type || '',
        EnclosureLength: String(targetItem?.enclosure?.length || ''),
        Duration: formaedDuration,
        Episode: String(targetItem?.itunesEpisode || ''),
        Explicit: String(targetItem?.itunesExplicit || false),
        Season: String(targetItem?.itunesSeason || ''),
        EpisodeType: String(targetItem?.itunesEpisodeType || ''),
        Description: targetItem?.description || targetItem?.content || "",
        TextDescription: targetItem?.description || targetItem?.contentSnippet || "",
        ChannelImageUrl: rssChannelInfo.itunesImage || rssChannelInfo.imageUrl || '',
        ChannelTitle: rssChannelInfo.title,
        HighlightChannelTitle: rssChannelInfo.title,
        FeedLink: feedLink,
        Count: 0,
        TookTime: 0,
        HasThumbnail: false,
        FeedId: podcastId,
        GUID: episodeId,
        Source: "itunes",
        ExcludeFeedId: "",
        Country: ""
    }

    return episodeInfo
}

const buildFeedChannelModel = (rssFeed: PodcastFeed & Parser.Output<PodcastItem>, feedLink: string, podcastId: string): FeedChannel => {
    const rssChannelInfo = rssFeed;
    var channelInfo: FeedChannel = {
        Id: podcastId,
        Title: rssChannelInfo.title,
        ChannelDesc: rssChannelInfo.description || '',
        TextChannelDesc: rssChannelInfo.description || '',
        ImageUrl: rssChannelInfo.itunes?.image || rssChannelInfo.itunesImage || '',
        Link: rssChannelInfo.link || '',
        FeedLink: feedLink,
        FeedType: rssChannelInfo.itunesType || '',
        Categories: rssChannelInfo.categories || [],
        Author: rssChannelInfo.itunes.author || rssChannelInfo.author || rssChannelInfo.itunesAuthor || '',
        OwnerName: rssChannelInfo.itunesOwner?.name || rssChannelInfo.itunes.owner.name || '',
        OwnerEmail: rssChannelInfo.itunesOwner?.email || rssChannelInfo.itunes.owner.email || '',
        Items: [],
        Count: rssChannelInfo.items.length,
        Copyright: rssChannelInfo.copyright || '',
        Language: rssChannelInfo.language || '',
        TookTime: 0,
        HasThumbnail: false
    };

    return channelInfo
}

const parsePodcastRSS = async (feedUrl: string): Promise<PodcastFeed & Parser.Output<PodcastItem>> => {
    const parser: Parser<PodcastFeed, PodcastItem> = new Parser();
    const rssResp = await fetch(feedUrl);
    const rssStr = await rssResp.text();
    const feed = await parser.parseString(rssStr);
    return feed
}