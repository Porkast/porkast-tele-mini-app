import { type Ref, forwardRef, useEffect, useState } from "react"


export type AddExcludeFeedIdDialogRef = {
    showModal: (channelTitle: string, feedId: string) => void
}

const AddExcludeFeedIdDialog = forwardRef<AddExcludeFeedIdDialogRef>((props, ref: Ref<AddExcludeFeedIdDialogRef>) => {

    const [modalElement, setModalElement] = useState<HTMLElement | null>(null);
    const [channelTitle, setChannelTitle] = useState<string>("");
    const [feedId, setFeedId] = useState<string>("");

    const addExcludeFeedId = () => {
        // Get current url parameters
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('excludeFeedId')) {
            const excludeFeedId = urlParams.get('excludeFeedId');
            if (excludeFeedId) {
                var newExcludeId = excludeFeedId + ',' + feedId;
                urlParams.set('excludeFeedId', newExcludeId);
            } else {
                urlParams.set('excludeFeedId', feedId);
            }
        } else {
            urlParams.set('excludeFeedId', feedId);
        }
        window.location.href = window.location.origin + '/search?' + urlParams.toString();

    }

    useEffect(() => {
        const dialog = document.getElementById('exclude_feed_id_modal') as HTMLDialogElement;
        setModalElement(dialog);
        if (ref) {
            (ref as any).current = {
                showModal: (channelTitle: string, feedId: string) => {
                    if (dialog) {
                        dialog.showModal();
                        setChannelTitle(channelTitle);
                        setFeedId(feedId);
                    }
                }
            }
        }

    }, [])

    return (
        <>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="exclude_feed_id_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Exclude Channel</h3>
                    <p className="py-4">Are you sure you want to exclude channel `{channelTitle}` from search result?</p>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn" onClick={addExcludeFeedId}>Yay</button>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
})

AddExcludeFeedIdDialog.displayName = 'AddExcludeFeedIdDialog';

export default AddExcludeFeedIdDialog;