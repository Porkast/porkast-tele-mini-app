import type { AudioPlayerParams } from '../types/AudioPlayer';
import { useAppContext } from './AppContext'

export default function AudioPlayButton({ data }: { data: AudioPlayerParams }) {

    const { updateAudio, play, pause } = useAppContext()

    const parseHtmlStrinText = (htmlString: string): string => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const textContent = doc.body.textContent;
        return textContent ?? '';
    }

    const onPlayBtnClick = () => {
        var textTitle = parseHtmlStrinText(data.title)
        var textAuthorName = parseHtmlStrinText(data.artist)

        const playerParams: AudioPlayerParams = {
            title: textTitle,
            artist: textAuthorName,
            cover: data.cover,
            src: data.src
        }
        updateAudio(playerParams)
        play()
    }

    return (
        <>
            <button className="btn btn-circle btn-outline btn-sm" onClick={onPlayBtnClick}>
                {/* <svg className="fill-current rounded-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z" /></svg> */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fill-current rounded-full ml-1"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            </button>
        </>
    )
}