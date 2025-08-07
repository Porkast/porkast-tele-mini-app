import { type Ref, forwardRef, useEffect, useState } from "react"
import { useAppContext } from "./AppContext"
import { createPlaylist } from "../libs/Playlist"
import type { UserInfo } from "../types/UserInfo"
import { MsgAlertType } from "./MsgAlert"

type CreatePlaylistDialogProps = {

}

export type CreatePlaylistDialogRef = {
    showDialog: (isMockData: boolean) => void
}

const CreatePlaylistDialog = forwardRef<CreatePlaylistDialogRef>((_props: CreatePlaylistDialogProps, ref: Ref<CreatePlaylistDialogRef>) => {

    const appContext = useAppContext()
    const [userId, setUserId] = useState('')
    const [isloading, setIsLoading] = useState(false)
    const [playlistName, setPlaylistName] = useState('')
    const [playlistDescription, setPlaylistDescription] = useState('')
    const [isMockData, setIsMockData] = useState(false)

    const onSubmitToCreatePlaylistBtnClick = async () => {
        if (isloading || isMockData) {
            return
        }
        setIsLoading(true)
        const createResp = await createPlaylist(userId, playlistName, playlistDescription)
        if (createResp && createResp.code == 0) {
            const dialog = document.getElementById("createPlaylistModal") as HTMLDialogElement;
            dialog.close()
            appContext.showMsgAlert(createResp.message, MsgAlertType.SUCCESS)
        } else {
            appContext.showMsgAlert(createResp.message, MsgAlertType.FAILED)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        const dialog = document.getElementById("createPlaylistModal") as HTMLDialogElement;
        if (ref) {
            (ref as any).current = {
                showDialog: async function (isMockData: boolean) {
                    setIsMockData(isMockData)
                    const userInfo: UserInfo = {
                        userId: '',
                        email: '',
                        token: '',
                        username: '',
                        avatar: ''
                    }
                    setUserId(userInfo.userId)
                    if (dialog) {
                        dialog.showModal();
                    }
                }
            }
        }

    }, [])

    return (
        <>
            <dialog id="createPlaylistModal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Create Playlist</h3>
                    <div className="form-control w-full max-w-2xl mt-4">
                        <label className="label">
                            <span className="label-text">What is playlist name?</span>
                        </label>
                        <input value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} type="text" placeholder="Type here" className="input input-bordered w-full max-w-2xl" />
                    </div>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Add some descriptioin?</span>
                        </label>
                        <textarea value={playlistDescription} onChange={(e) => setPlaylistDescription(e.target.value)} className="textarea textarea-bordered h-24" placeholder="The playlist description"></textarea>
                    </div>
                    <div className="modal-action">
                        {
                            isloading ? (
                                <>
                                    <button className="btn" onClick={onSubmitToCreatePlaylistBtnClick}><span className="loading loading-spinner loading-sm"></span> Submit</button>
                                </>
                            ) : (
                                <button className="btn" onClick={onSubmitToCreatePlaylistBtnClick}>Submit</button>
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

CreatePlaylistDialog.displayName = 'CreatePlaylistDialog'

export default CreatePlaylistDialog;