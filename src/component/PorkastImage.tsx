import { useEffect, useState } from "react"

const AVATAR_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#E74C3C', '#3498DB', '#2ECC71',
    '#9B59B6', '#1ABC9C', '#E67E22', '#F1C40F', '#34495E'
]

function getColorFromName(name: string): string {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getInitial(name: string): string {
    return name.charAt(0).toUpperCase()
}

type AvatarImageProps = {
    imageUrl?: string
    className?: string
    displayName?: string
}

export const AvatarImage = ({ imageUrl, className, displayName }: AvatarImageProps) => {

    const [avatarUrl, setAvatarUrl] = useState("")

    useEffect(() => {
        setAvatarUrl(imageUrl || "")
    }, [imageUrl])

    return (
        <>
            <div className="avatar">
                <div className={`rounded-xl ${className}`}>
                    {
                        avatarUrl ?
                            <img src={avatarUrl} />
                        : displayName ?
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 100 100"
                                className="w-full h-full"
                            >
                                <circle cx="50" cy="50" r="50" fill={getColorFromName(displayName)} />
                                <text
                                    x="50"
                                    y="50"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fill="white"
                                    fontSize="40"
                                    fontWeight="bold"
                                    fontFamily="system-ui, -apple-system, sans-serif"
                                >
                                    {getInitial(displayName)}
                                </text>
                            </svg>
                        :
                            <img src="/porkast-text-logo.png" />
                    }
                </div>
            </div>
        </>
    )
}
