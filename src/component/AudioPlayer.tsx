import 'shikwasa/dist/style.css'
import { Player } from 'shikwasa'
import { type Ref, forwardRef, useEffect, useState } from 'react';
import type { AudioPlayerParams } from '../types/AudioPlayer';

export type AudioPlayerProps = {
    data?: AudioPlayerParams;
};

export type AudioPlayerRef = {
    play: () => void;
    pause: () => void;
    updateAudioData: ({ params }: { params: AudioPlayerParams }) => void;
    seek: (time: number) => void;
};

const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>((props, ref: Ref<AudioPlayerRef>) => {
    const { data } = props;
    const [showAudioPlayer, setShowAudioPlayer] = useState(false);
    const { title, artist, cover, src } = data ?? { title: '', artist: '', cover: '', src: '' };
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    var systemTheme = mediaQuery.matches ? 'dark' : 'light';
    var themeColor = systemTheme === 'dark' ? 'white' : 'black';

    useEffect(() => {

        const playerElement = document.querySelector('.shikwasa-player-element') as HTMLElement;
        const playerTitleElemet = document.querySelector('.shk-title') as HTMLElement;
        if (playerElement !== null) {
            const player = new Player({
                container: () => playerElement,
                audio: {
                    title,
                    artist,
                    cover,
                    src,
                },
                theme: 'auto',
                themeColor: themeColor,
                autoplay: true,
            });

            player.on('playing', () => {
                // when audio is playing translate the player to the right with 688px
                setShowAudioPlayer(true);
                playerElement.classList.add('md:translate-x-610', 'transition', 'duration-300', 'delay-150');
                playerTitleElemet.classList.add('overflow-x-auto', 'whitespace-nowrap', 'overflow-hidden', 'overflow-ellipsis');
            });
            if (ref) {
                (ref as any).current = {
                    play: () => {
                        setShowAudioPlayer(true);
                        player.play();
                    },
                    pause: () => {
                        player.pause();
                    },
                    updateAudioData: ({ params }: { params: AudioPlayerParams }) => {
                        player.update({
                            title: params.title,
                            artist: params.artist,
                            cover: params.cover,
                            src: params.src
                        })
                    },
                    seek: (time: number) => {
                        player.seek(time);
                    }
                }
            }
        }
    }, [src]);

    return (
        <div className='w-full flex justify-end' style={{ visibility: showAudioPlayer ? 'visible' : 'hidden' }}>
            < div className="shikwasa-player-element fixed bottom-0 w-md md:bottom-36 md:hover:translate-x-0" >
            </div >
        </div >
    );
})

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;