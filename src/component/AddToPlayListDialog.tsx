import { type Ref, forwardRef, useEffect, useState } from "react"
import { useAppContext } from "./AppContext"
import { MsgAlertType } from "./MsgAlert"
import type { UserPlaylistDto } from "../types/Playlist"
import { addToPlayList, getUserPlaylistByUserId } from "../libs/Playlist"
import type { UserInfo } from "../types/UserInfo"

export type AddToPlayListDialogProps = {

}

export type AddToPlayListDialogRef = {
    showDialog: (itemTitle: string, feedId: string, guid: string, source: string) => void
}

const AddToPlayListDialog = forwardRef<AddToPlayListDialogRef>((props: AddToPlayListDialogProps, ref: Ref<AddToPlayListDialogRef>) => {

    const appContext = useAppContext()
    const [dialogInstance, setDialogInstance] = useState<HTMLDialogElement>()
    const [title, setTitle] = useState('')
    const [isloading, setIsLoading] = useState(false)
    const [userPlaylists, setUserPlaylists] = useState<UserPlaylistDto[]>()
    const [selectedPlaylistId, setSelectedPlaylistId] = useState('Select a playlist')
    const [currentUserId, setCurrentUserId] = useState('')
    const [guid, setGuid] = useState('')
    const [feedId, setFeedId] = useState('')
    const [source, setSource] = useState('itunes')
    const [isMockData, setIsMockData] = useState(false)

    const onSelectValueChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPlaylistId(e.target.value)
    }

    useEffect(() => {
        const dialog = document.getElementById("addToPlaylistModal") as HTMLDialogElement;
        setDialogInstance(dialog)
        if (ref) {
            (ref as any).current = {
                showDialog: async (itemTitle: string, feedId: string, guid: string, source: string = 'itunes') => {
                    setTitle(itemTitle)
                    if (dialog) {
                        dialog.showModal();
                        const userInfo: UserInfo = {
                            userId: '',
                            email: '',
                            token: '',
                            username: '',
                            avatar: ''
                        }
                        setCurrentUserId(userInfo.userId)
                        setGuid(guid)
                        setFeedId(feedId)
                        setSource(source)
                        if (!guid || !feedId) {
                            setIsMockData(true)
                            return
                        }
                        const userPlaylistResp = await getUserPlaylistByUserId(userInfo.userId)
                        if (userPlaylistResp) {
                            setUserPlaylists(userPlaylistResp.data)
                        }
                    }
                }
            }
        }
    }, [])

    const onSubmitToPlaylistBtnClick = async () => {
        if (!isSubmitParamsValid()) {
            return
        }
        if (isloading) {
            return
        }
        setIsLoading(true)
        if (currentUserId == '') {
            appContext.showMsgAlert('Please login first', MsgAlertType.FAILED)
            return
        }
        const resp = await addToPlayList(currentUserId, feedId, guid, selectedPlaylistId, source).finally(() => {
            setIsLoading(false)
        })
        setIsLoading(false)
        if (resp && resp.code == 0) {
            appContext.showMsgAlert(resp.message, MsgAlertType.SUCCESS)
        } else {
            appContext.showMsgAlert(resp.message, MsgAlertType.FAILED)
        }
        dialogInstance?.close()
    }

    const isSubmitParamsValid = () => {
        if (selectedPlaylistId == 'Select a playlist' || selectedPlaylistId == '') {
            appContext.showMsgAlert('Please select a playlist', MsgAlertType.FAILED)
            return false
        }
        return true
    }

    const onCreateNewPlaylistBtnClick = () => {
        appContext.createPlaylistFunction(isMockData)
    }

    return (
        <>
            <dialog id="addToPlaylistModal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Add to Playlist</h3>
                    <p className="py-4">Add `{title}` to ...</p>
                    <select className="select select-sm select-bordered w-full max-w-xs" value={selectedPlaylistId} onChange={onSelectValueChanged}>
                        <option disabled>Select a playlist</option>
                        {
                            userPlaylists?.map((playlist) => {
                                return (
                                    <option key={playlist.Id} value={playlist.Id}>{playlist.PlaylistName}</option>
                                )
                            })
                        }
                    </select>
                    <form method="dialog" className="w-full flex justify-start">
                        <button className="btn btn-link -ml-4 mt-6" onClick={onCreateNewPlaylistBtnClick}>Or Create Playlist</button>
                    </form>
                    <div className="modal-action">
                        {
                            isloading ? (
                                <>
                                    <button className="btn" onClick={onSubmitToPlaylistBtnClick}><span className="loading loading-spinner loading-sm"></span> Submit</button>
                                </>
                            ) : (
                                <button className="btn" onClick={onSubmitToPlaylistBtnClick}>Submit</button>
                            )
                        }
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
})

AddToPlayListDialog.displayName = 'AddToPlayListDialog'

export default AddToPlayListDialog;