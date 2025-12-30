import { useAppContext } from "../../component/AppContext";
import Footer from "../../component/Footer";
import CreatePlaylistDialog from "../../component/CreatePlaylistDialog";

export default function PlayListIndexPage() {
    const appContext = useAppContext();

    return (
        <>
            <div className="w-full flex justify-center mb-9 min-h-screen pt-20">
                <div className="w-full max-w-2xl pl-6 pr-6">
                    <div className="text-2xl font-semibold flex justify-center w-full italic text-center mt-4">
                        Create a Podcast Playlist
                    </div>
                    <div className="text-xl font-bold flex justify-center w-full italic text-center mt-4">
                        Save Podcast to Your <span className="text-primary">&nbsp;Playlist&nbsp;</span>
                    </div>
                    <div className="text-xl font-bold flex justify-center w-full italic text-center mt-4">
                        Just Like Music Playlist
                    </div>

                    <div className="w-full flex justify-center mt-8">
                        <button
                            className="btn btn-primary"
                            onClick={() => appContext.createPlaylistFunction(false)}
                        >
                            Create Playlist
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
            <CreatePlaylistDialog />
        </>
    )
}
