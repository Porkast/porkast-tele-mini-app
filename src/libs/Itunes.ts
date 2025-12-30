import { convertMillsTimeToDuration, getUserLocale } from "./Common"
import type { FeedItem } from "../types/FeedItem";
import type { FeedChannel } from "../types/FeedChannel";

interface RssItem {
    guid: string;
    title: string;
    link: string;
    description: string;
    contentSnippet: string;
    pubDate: string;
    itunes: {
        author: string;
        duration: string;
        image: string;
        episode?: string;
        season?: string;
        explicit?: boolean;
        episodeType?: string;
    };
    enclosure: {
        url: string;
        type: string;
        length: string;
    };
}

interface RssFeed {
    title: string;
    description: string;
    link: string;
    itunes: {
        author: string;
        image: string;
        owner: {
            name: string;
            email: string;
        };
        categories: string[];
        type: string;
    };
    imageUrl: string;
    copyright: string;
    language: string;
    items: RssItem[];
}

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

const buildFeedItemModel = (rssFeed: RssFeed, feedLink: string, episodeId: string, podcastId: string): FeedItem => {
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
    const durationStr = String(targetItem?.itunes.duration || '')
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
        Author: targetItem?.itunes.author || rssChannelInfo.itunes.author || '',
        InputDate: new Date(targetItem?.pubDate || ''),
        ImageUrl: targetItem?.itunes.image || rssChannelInfo.itunes.image || rssChannelInfo.imageUrl || '',
        EnclosureUrl: targetItem?.enclosure?.url || '',
        EnclosureType: targetItem?.enclosure?.type || '',
        EnclosureLength: String(targetItem?.enclosure?.length || ''),
        Duration: formaedDuration,
        Episode: String(targetItem?.itunes.episode || ''),
        Explicit: String(targetItem?.itunes.explicit || false),
        Season: String(targetItem?.itunes.season || ''),
        EpisodeType: String(targetItem?.itunes.episodeType || ''),
        Description: targetItem?.description || "",
        TextDescription: targetItem?.contentSnippet || targetItem?.description || "",
        ChannelImageUrl: rssChannelInfo.itunes.image || rssChannelInfo.imageUrl || '',
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

const buildFeedChannelModel = (rssFeed: RssFeed, feedLink: string, podcastId: string): FeedChannel => {
    const rssChannelInfo = rssFeed;
    var channelInfo: FeedChannel = {
        Id: podcastId,
        Title: rssChannelInfo.title,
        ChannelDesc: rssChannelInfo.description || '',
        TextChannelDesc: rssChannelInfo.description || '',
        ImageUrl: rssChannelInfo.itunes.image || rssChannelInfo.imageUrl || '',
        Link: rssChannelInfo.link || '',
        FeedLink: feedLink,
        FeedType: rssChannelInfo.itunes.type || '',
        Categories: rssChannelInfo.itunes.categories || [],
        Author: rssChannelInfo.itunes.author || '',
        OwnerName: rssChannelInfo.itunes.owner.name || '',
        OwnerEmail: rssChannelInfo.itunes.owner.email || '',
        Items: [],
        Count: rssChannelInfo.items.length,
        Copyright: rssChannelInfo.copyright || '',
        Language: rssChannelInfo.language || '',
        TookTime: 0,
        HasThumbnail: false
    };

    return channelInfo
}

const parsePodcastRSS = async (feedUrl: string): Promise<RssFeed> => {
    const response = await fetch(feedUrl);
    const xmlText = await response.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    const channel = xmlDoc.querySelector('channel');
    if (!channel) {
        throw new Error('Invalid RSS feed');
    }

    // Parse channel-level elements
    const title = channel.querySelector('title')?.textContent || '';
    const description = channel.querySelector('description')?.textContent || '';
    const link = channel.querySelector('link')?.textContent || '';
    const copyright = channel.querySelector('copyright')?.textContent || '';
    const language = channel.querySelector('language')?.textContent || '';

    // Parse itunes elements
    const itunesAuthor = channel.getElementsByTagName('itunes:author')[0]?.textContent || '';
    const itunesType = channel.getElementsByTagName('itunes:type')[0]?.textContent || '';
    const itunesOwnerName = channel.getElementsByTagName('itunes:name')[0]?.textContent || '';
    const itunesOwnerEmail = channel.getElementsByTagName('itunes:email')[0]?.textContent || '';

    // Parse itunes:image
    const itunesImageEl = channel.getElementsByTagName('itunes:image')[0];
    const itunesImage = itunesImageEl?.getAttribute('href') || '';

    // Parse itunes:categories
    const categories: string[] = [];
    const categoryEls = channel.getElementsByTagName('itunes:category');
    for (let i = 0; i < categoryEls.length; i++) {
        const catText = categoryEls[i].getAttribute('text');
        if (catText) {
            categories.push(catText);
        }
    }

    // Parse standard image
    const imageEl = channel.querySelector('image');
    const imageUrl = imageEl?.querySelector('url')?.textContent || '';

    // Parse items
    const items: RssItem[] = [];
    const itemEls = channel.querySelectorAll('item');

    for (const itemEl of itemEls) {
        const guid = itemEl.querySelector('guid')?.textContent || itemEl.querySelector('link')?.textContent || '';
        const itemTitle = itemEl.querySelector('title')?.textContent || '';
        const itemLink = itemEl.querySelector('link')?.textContent || '';
        const itemDescription = itemEl.querySelector('description')?.textContent || '';
        const contentSnippet = itemEl.querySelector('content\\:snippet')?.textContent || '';
        const pubDate = itemEl.querySelector('pubDate')?.textContent || '';

        // Parse itunes elements
        const itAuthor = itemEl.getElementsByTagName('itunes:author')[0]?.textContent || '';
        const itDuration = itemEl.getElementsByTagName('itunes:duration')[0]?.textContent || '';
        const itEpisode = itemEl.getElementsByTagName('itunes:episode')[0]?.textContent || '';
        const itSeason = itemEl.getElementsByTagName('itunes:season')[0]?.textContent || '';
        const itExplicit = itemEl.getElementsByTagName('itunes:explicit')[0]?.textContent || '';
        const itEpisodeType = itemEl.getElementsByTagName('itunes:episodeType')[0]?.textContent || '';
        const itImageEl = itemEl.getElementsByTagName('itunes:image')[0];
        const itImage = itImageEl?.getAttribute('href') || '';

        // Parse enclosure
        const enclosureEl = itemEl.querySelector('enclosure');
        const enclosureUrl = enclosureEl?.getAttribute('url') || '';
        const enclosureType = enclosureEl?.getAttribute('type') || '';
        const enclosureLength = enclosureEl?.getAttribute('length') || '';

        items.push({
            guid,
            title: itemTitle,
            link: itemLink,
            description: itemDescription,
            contentSnippet,
            pubDate,
            itunes: {
                author: itAuthor,
                duration: itDuration,
                image: itImage,
                episode: itEpisode,
                season: itSeason,
                explicit: itExplicit === 'true',
                episodeType: itEpisodeType
            },
            enclosure: {
                url: enclosureUrl,
                type: enclosureType,
                length: enclosureLength
            }
        });
    }

    return {
        title,
        description,
        link,
        itunes: {
            author: itunesAuthor,
            image: itunesImage,
            owner: {
                name: itunesOwnerName,
                email: itunesOwnerEmail
            },
            categories,
            type: itunesType
        },
        imageUrl,
        copyright,
        language,
        items
    };
}
