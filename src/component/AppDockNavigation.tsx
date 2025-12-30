import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { getTelegramUserInfo } from "../libs/User"


function AppDockNavigation() {

    const location = useLocation()
    const navigate = useNavigate()
    const isActive = (path: string) => {
        if (location.pathname === "/" && path === "/") {
            return true
        }
        return location.pathname === `/${path}` || location.pathname.startsWith(`/${path}/`)
    }

    const onTabClicked = (tab: string) => {
        const sessionUser = getTelegramUserInfo()
        if (tab === "subscription") {
            navigate("/subscription")
        } else if (tab === "listenlater") {
            navigate(`/listenlater/${sessionUser.id}`)
        } else if (tab === "playlist") {
            navigate(`/playlist/${sessionUser.id}`)
        } else if (tab === "account") {
            navigate("/account")
        } else {
            navigate("/")
        }
    }

    return (
        <>
            <div className="pb-10">
                <Outlet />
            </div>
            <div className="dock">
                <button className={isActive("/") ? "dock-active" : ""} onClick={() => onTabClicked("/")}>
                    <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" enableBackground="new 0 0 32 32" xmlSpace="preserve"><circle fill="none" stroke="#000000" strokeWidth={2} strokeMiterlimit={10} cx={19.5} cy={12.5} r={8.5} /><line fill="none" stroke="#000000" strokeWidth={2} strokeMiterlimit={10} x1={4} y1={28} x2={14} y2={18} /></svg>
                    <span className="dock-label">Search</span>
                </button>

                <button className={isActive("subscription") ? "dock-active" : ""} onClick={() => onTabClicked("subscription")}>
                    <svg className="size-[1.2em]" width="800px" height="800px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 13H3v-2c1.11 0 2 .89 2 2zM3 3v1a9 9 0 0 1 9 9h1C13 7.48 8.52 3 3 3zm0 4v1c2.75 0 5 2.25 5 5h1c0-3.31-2.69-6-6-6z" /></svg>
                    <span className="dock-label">Subscription</span>
                </button>
                <button className={isActive("listenlater") ? "dock-active" : ""} onClick={() => onTabClicked("listenlater")}>
                    <svg className="size-[1.2em]" fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M10,17 L10,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 C1,1.8954305 1.8954305,1 3,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,10 L17,10 L17,3 L3,3 L3,17 L10,17 Z M8,7 L12,10 L8,13 L8,7 Z M17,23 C13.6862915,23 11,20.3137085 11,17 C11,13.6862915 13.6862915,11 17,11 C20.3137085,11 23,13.6862915 23,17 C23,20.3137085 20.3137085,23 17,23 Z M17,21 C19.209139,21 21,19.209139 21,17 C21,14.790861 19.209139,13 17,13 C14.790861,13 13,14.790861 13,17 C13,19.209139 14.790861,21 17,21 Z M16,18 L16,14 L18,14 L18,16 L20,16 L20,18 L16,18 Z" />
                    </svg>
                    <span className="dock-label">Listen Later</span>
                </button>

                <button className={isActive("playlist") ? "dock-active" : ""} onClick={() => onTabClicked("playlist")}>
                    <svg className="size-[1.2em]" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_429_11182)">
                            <path d="M6 6L3 7.73205L3 4.26795L6 6Z" stroke="#292929" stroke-width="2.5" stroke-linejoin="round" />
                            <path d="M3 12L21 12" stroke="#292929" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M10 6L21 6" stroke="#292929" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M3 18L21 18" stroke="#292929" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_429_11182">
                                <rect width="24" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    <span className="dock-label">Play List</span>
                </button>
            </div>
        </>
    )
}

export default AppDockNavigation
