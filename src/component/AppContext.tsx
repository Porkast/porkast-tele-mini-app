import { createContext, useContext, useEffect, useRef, useState, } from 'react';
import AudioPlayer, { type AudioPlayerRef } from './AudioPlayer';
import { MsgAlert, type MsgAlertRef, type MsgAlertType } from './MsgAlert';
import AddToPlayListDialog, { type AddToPlayListDialogRef } from './AddToPlayListDialog';
import CreatePlaylistDialog, { type CreatePlaylistDialogRef } from './CreatePlaylistDialog';
import type { AudioPlayerParams } from '../types/AudioPlayer';
import { getTelegramUserInfo, getUserInfoByTelegramUserId, type ServerUserInfo } from '../libs/User';

type AppContextType = {
    userInfo: ServerUserInfo | null;
    updateAudio: (params: AudioPlayerParams) => void;
    play: () => void;
    pause: () => void;
    seek: (time: number) => void;
    showMsgAlert: (msg: string, msgType: MsgAlertType) => void;
    addToPlayListFunction: (userId: string, title: string, feedId: string, guid: string, source: string) => void;
    createPlaylistFunction: (isMockData: boolean) => void
};

const AppContext = createContext<AppContextType>({
    userInfo: null,
    play: () => { },
    pause: () => { },
    seek: (time: number) => { },
    updateAudio: function (params: AudioPlayerParams): void {
        throw new Error('Function not implemented.');
    },
    showMsgAlert: function (msg: string, msgType: MsgAlertType): void {
    },
    addToPlayListFunction: function (userId: string, title: string, feedId: string, guid: string, source: string): void {
    },
    createPlaylistFunction: function (isMockData: boolean): void {
    }
});

export const useAppContext = () => useContext(AppContext);

type AppProviderProps = {
    children: React.ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const audioRef = useRef<AudioPlayerRef>(null);
    const msgAlertRef = useRef<MsgAlertRef>(null)
    const addToPlaylistModalRef = useRef<AddToPlayListDialogRef>(null)
    const createPlaylistModalRef = useRef<CreatePlaylistDialogRef>(null)
    const [userInfo, setUserInfo] = useState<ServerUserInfo | null>(null);
    const appContextValue: AppContextType = {
        play: () => {
            if (audioRef.current) {
                audioRef.current.play();
            }
        },
        pause: () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        },
        updateAudio: function (params: AudioPlayerParams): void {
            if (audioRef.current) {
                audioRef.current.updateAudioData({ params });
            }
        },
        seek: (time: number) => {
            if (audioRef.current) {
                audioRef.current.seek(time);
            }
        },
        showMsgAlert: function (msg: string, msgType: MsgAlertType): void {
            msgAlertRef.current?.showAlert(msg, msgType);
        },
        addToPlayListFunction: function (userId: string, title: string, feedId: string, guid: string, source: string): void {
            addToPlaylistModalRef.current?.showDialog(title, feedId, guid, source);
        },
        createPlaylistFunction: function (isMockData: boolean): void {
            createPlaylistModalRef.current?.showDialog(isMockData);
        },
        userInfo: userInfo,
    };

    useEffect(() => {
        const getUserInfoByTeleId = async (): Promise<ServerUserInfo> => {
            const telegramUserInfo =  getTelegramUserInfo();
            console.log(`telegramUserInfo: ${JSON.stringify(telegramUserInfo)}`);
            const userInfo = await getUserInfoByTelegramUserId(String(telegramUserInfo.id));
            return userInfo.data;
        }
        const userInfoCacheStr = localStorage.getItem('userInfo');
        if (userInfoCacheStr) {
            setUserInfo(JSON.parse(userInfoCacheStr));
        } else {
            getUserInfoByTeleId().then(userInfo => {
                if (userInfo.userId === '' || userInfo.userId === undefined || userInfo.userId === null) {
                    return
                }
                setUserInfo(userInfo);
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
            });
        }
    }, []);

    return (
        <AppContext.Provider value={appContextValue}>
            {children}
            <AudioPlayer ref={audioRef} data={{ title: 'porkast', artist: 'porkast', cover: 'https://shikwasa.js.org/assets/logo.png', src: 'https://shikwasa.js.org/assets/STS-133_FD11_Mission_Status_Briefing.mp3' }} />
            <MsgAlert ref={msgAlertRef} />
            <AddToPlayListDialog ref={addToPlaylistModalRef} />
            <CreatePlaylistDialog ref={createPlaylistModalRef} />
        </AppContext.Provider>
    );
};