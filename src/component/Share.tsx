import { useNavigate } from "react-router-dom"
import { useAppContext } from "./AppContext"
import { MsgAlertType } from "./MsgAlert"

export type SharePlaylistBtnProps = {
    userId: string
    playlistId: string
}

export const SharePlaylistBtn = (props: SharePlaylistBtnProps) => {

    const navigate = useNavigate()

    const onShareBtnClick = () => {
        navigate('/share/playlist/' + props.playlistId + '/' + props.userId)
    }

    return (
        <>
            <button className="btn btn-neutral ml-2 btn-sm flex items-center rounded-lg" onClick={onShareBtnClick}>
                <svg className="w-4 h-4" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3141" width="32" height="32"><path d="M736 800c-35.296 0-64-28.704-64-64s28.704-64 64-64 64 28.704 64 64-28.704 64-64 64M288 576c-35.296 0-64-28.704-64-64s28.704-64 64-64 64 28.704 64 64-28.704 64-64 64M736 224c35.296 0 64 28.704 64 64s-28.704 64-64 64-64-28.704-64-64 28.704-64 64-64m0 384a127.776 127.776 0 0 0-115.232 73.28l-204.896-117.056a30.848 30.848 0 0 0-9.696-3.2A127.68 127.68 0 0 0 416 512c0-6.656-0.992-13.088-1.984-19.456 0.608-0.32 1.28-0.416 1.856-0.768l219.616-125.472A127.328 127.328 0 0 0 736 416c70.592 0 128-57.408 128-128s-57.408-128-128-128-128 57.408-128 128c0 6.72 0.992 13.152 1.984 19.616-0.608 0.288-1.28 0.256-1.856 0.608l-219.616 125.472A127.328 127.328 0 0 0 288 384c-70.592 0-128 57.408-128 128s57.408 128 128 128a126.912 126.912 0 0 0 84.544-32.64 31.232 31.232 0 0 0 11.584 12.416l224 128c0.352 0.224 0.736 0.256 1.12 0.448C615.488 812.992 669.6 864 736 864c70.592 0 128-57.408 128-128s-57.408-128-128-128" fill="currentColor" p-id="3142"></path></svg>
                <span className="font-bold text-xs md:display">Share</span>
            </button>
        </>
    )
}


export type SharedListenLaterBtnProps = {
    creatorId: string
}

export const SharedListenLaterBtn = (props: SharedListenLaterBtnProps) => {

    const navigate = useNavigate()

    const onShareBtnClick = () => {
        navigate('/share/listenlater/' + props.creatorId)
    }

    return (
        <>
            <button className="btn btn-neutral ml-2 btn-sm flex items-center rounded-lg" onClick={onShareBtnClick}>
                <svg className="w-4 h-4" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3141" width="32" height="32"><path d="M736 800c-35.296 0-64-28.704-64-64s28.704-64 64-64 64 28.704 64 64-28.704 64-64 64M288 576c-35.296 0-64-28.704-64-64s28.704-64 64-64 64 28.704 64 64-28.704 64-64 64M736 224c35.296 0 64 28.704 64 64s-28.704 64-64 64-64-28.704-64-64 28.704-64 64-64m0 384a127.776 127.776 0 0 0-115.232 73.28l-204.896-117.056a30.848 30.848 0 0 0-9.696-3.2A127.68 127.68 0 0 0 416 512c0-6.656-0.992-13.088-1.984-19.456 0.608-0.32 1.28-0.416 1.856-0.768l219.616-125.472A127.328 127.328 0 0 0 736 416c70.592 0 128-57.408 128-128s-57.408-128-128-128-128 57.408-128 128c0 6.72 0.992 13.152 1.984 19.616-0.608 0.288-1.28 0.256-1.856 0.608l-219.616 125.472A127.328 127.328 0 0 0 288 384c-70.592 0-128 57.408-128 128s57.408 128 128 128a126.912 126.912 0 0 0 84.544-32.64 31.232 31.232 0 0 0 11.584 12.416l224 128c0.352 0.224 0.736 0.256 1.12 0.448C615.488 812.992 669.6 864 736 864c70.592 0 128-57.408 128-128s-57.408-128-128-128" fill="currentColor" p-id="3142"></path></svg>
                <span className="font-bold text-xs md:display">Share</span>
            </button>
        </>
    )
}


export type ShareSearchSubscriptionBtnProps = {
    userId: string
    keyword: string
}

export const ShareSearchSubscriptionBtn = (props: ShareSearchSubscriptionBtnProps) => {

    const navigate = useNavigate()

    const onShareBtnClick = () => {
        navigate('/share/subscription/' + props.userId + '/' + props.keyword)
    }

    return (
        <>
            <button className="btn btn-neutral ml-2 btn-sm flex items-center rounded-lg" onClick={onShareBtnClick}>
                <svg className="w-4 h-4" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3141" width="32" height="32"><path d="M736 800c-35.296 0-64-28.704-64-64s28.704-64 64-64 64 28.704 64 64-28.704 64-64 64M288 576c-35.296 0-64-28.704-64-64s28.704-64 64-64 64 28.704 64 64-28.704 64-64 64M736 224c35.296 0 64 28.704 64 64s-28.704 64-64 64-64-28.704-64-64 28.704-64 64-64m0 384a127.776 127.776 0 0 0-115.232 73.28l-204.896-117.056a30.848 30.848 0 0 0-9.696-3.2A127.68 127.68 0 0 0 416 512c0-6.656-0.992-13.088-1.984-19.456 0.608-0.32 1.28-0.416 1.856-0.768l219.616-125.472A127.328 127.328 0 0 0 736 416c70.592 0 128-57.408 128-128s-57.408-128-128-128-128 57.408-128 128c0 6.72 0.992 13.152 1.984 19.616-0.608 0.288-1.28 0.256-1.856 0.608l-219.616 125.472A127.328 127.328 0 0 0 288 384c-70.592 0-128 57.408-128 128s57.408 128 128 128a126.912 126.912 0 0 0 84.544-32.64 31.232 31.232 0 0 0 11.584 12.416l224 128c0.352 0.224 0.736 0.256 1.12 0.448C615.488 812.992 669.6 864 736 864c70.592 0 128-57.408 128-128s-57.408-128-128-128" fill="currentColor" p-id="3142"></path></svg>
                <span className="font-bold text-xs md:display">Share</span>
            </button>
        </>
    )
}

export const CopyRSSLinkBtn = (props: { rssLink: string }) => {

    const appContext = useAppContext()
    const rssLink = props.rssLink

    const onCopyBtnClick = () => {
        navigator.clipboard.writeText(rssLink)
        if (!appContext) {
            return
        }
        appContext.showMsgAlert('Copied to clipboard!', MsgAlertType.INFO)
    }


    return (
        <div className="join w-full">
            <input type="text" defaultValue={rssLink} className="input input-bordered join-item w-full" />
            <button className="btn btn-primary join-item rounded-r-full" onClick={onCopyBtnClick}>Copy</button>
        </div>
    )
}