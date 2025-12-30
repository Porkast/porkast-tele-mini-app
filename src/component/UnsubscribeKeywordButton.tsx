import { useNavigate } from "react-router-dom"
import { useState } from "react";
import { unsubscribeKeyword } from "../libs/Subscription";

type UnsubscribeKeywordButtonProps = {
    userId: string;
    keyword: string;
}

export default function UnsubscribeKeywordButton(props: UnsubscribeKeywordButtonProps) {

    const { userId, keyword } = props
    const [isUnsubscribing, setIsUnsubscribing] = useState(false)
    const navigate = useNavigate()

    const onUnsubscribeBtnClick = async () => {
        if (!confirm(`Are you sure you want to unsubscribe from "${decodeURIComponent(keyword)}"?`)) {
            return
        }

        setIsUnsubscribing(true)
        try {
            const result = await unsubscribeKeyword(userId, decodeURIComponent(keyword))

            if (result.code === 0) {
                // Redirect to subscription list page after successful unsubscribe
                navigate(`/subscription/${userId}`)
            } else {
                alert(result.message || 'Failed to unsubscribe. Please try again.')
            }
        } catch (error) {
            console.error('Error unsubscribing:', error)
            alert('An error occurred while unsubscribing. Please try again.')
        } finally {
            setIsUnsubscribing(false)
        }
    }

    return (
        <>
            <button
                className={`btn btn-neutral ml-2 btn-sm flex items-center rounded-lg ${isUnsubscribing ? 'loading' : ''}`}
                onClick={onUnsubscribeBtnClick}
                disabled={isUnsubscribing}
            >
                {isUnsubscribing ? (
                    <span className="loading loading-spinner"></span>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4">
                        <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                )}
            </button>
        </>
    )
}