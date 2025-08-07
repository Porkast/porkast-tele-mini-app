import type { Feed, Item } from "podcast";

export interface PodcastFeed extends Feed {
    itunes: {
        title: string
        author: string
        summary: string
        owner: {
            name: string
            email: string
        }
        image: string
        type: string
        categories: string[]
    }
    items: PodcastItem
}

export interface PodcastItem extends Item {
    itunes: {
        duration: string
        image: string
        author: string
        title: string
        episode: string
        season: string
        summary: string
    }
}