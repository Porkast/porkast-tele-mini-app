import { useEffect, useState } from "react"


type AvatarImageProps = {
    imageUrl?: string
    className?: string
}

export const AvatarImage = ({ imageUrl, className }: AvatarImageProps) => {

    const [avatarUrl, setAvatarUrl] = useState("")

    useEffect(() => {
        if (imageUrl) {
            setAvatarUrl(imageUrl)
        }
    }, [imageUrl])

    return (
        <>
            <div className="avatar">
                <div className={`rounded-xl ${className}`}>
                    {
                        avatarUrl ?
                            <img src={avatarUrl} />
                            :
                            <img src="/porkast-text-logo.png" />
                    }
                </div>
            </div>
        </>
    )
}