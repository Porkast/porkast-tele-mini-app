import SearchInput from '../component/SearchInput'
import blackLogo from '../assets/porkast-text-logo-black.jpg'

export default function SearchPage() {
    return (
        <>
            <div className='flex with-full justify-center'>
                <div className='mt-6'>
                    <div className="w-full flex justify-center">
                        <img src={blackLogo} alt="Porkast" className="w-96 block" />
                    </div>
                    <div className="text-xl font-semibold flex justify-center w-full italic text-center text-black">
                        Discover, Subscribe, Share
                    </div>
                    <div className="text-lg text-primary font-bold flex justify-center w-full italic text-center mt-2">
                        Your Personalized Podcast
                    </div>
                </div>
            </div>
            <div className="mt-6">
                <div className="w-full flex justify-center mt-9 pl-6 pr-6">
                    <SearchInput placeholder="Start from search" />
                </div>
            </div>
        </>
    )
}