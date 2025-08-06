import { useEffect, useState } from "react";

type SearchInputProps = {
    placeholder?: string
}

export default function SearchInput(props: SearchInputProps) {

    const [searchInputVal, setSearchInputVal] = useState('');

    const onSearchButtonClicked = () => {
        if (searchInputVal.length == 0) {
            return
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
    }, [searchInputVal])

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearchButtonClicked()
        }
    }

    return (
        <>
            <div className="join w-full justify-center">
                <input className="w-full max-w-2xl input input-bordered join-item" placeholder={props.placeholder} onChange={(e) => setSearchInputVal(e.target.value)} />
                <div className="indicator">
                    <button className="btn btn-primary join-item" onClick={onSearchButtonClicked}>Search</button>
                </div>
            </div>
        </>
    )
}