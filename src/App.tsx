import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SearchPage from './pages/SearchPage'
import AppDockNavigation from './component/AppDockNavigation'
import ListenLaterPage from './pages/ListenLaterPage'
import PlayListIndexPage from './pages/playlist/index'
import PlayListPage from './pages/playlist/PlayListPage'
import PlayListDetailPage from './pages/playlist/PlayListDetailPage'
import AccountPage from './pages/AccountPage'
import SubscriptionPage from './pages/subscription/SubscriptionPage'
import SearchResultPage from './pages/SearchResultPage'
import { AppProvider } from './component/AppContext'
import SubscriptionKeywordListPage from './pages/subscription/SubscriptionKeywordListPage'
import PodcastChannelPage from './pages/PodcastChannelPage'
import PodcastEpisodePage from './pages/PodcastEpisodePage'

function App() {

    return (
        <AppProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AppDockNavigation />}>
                        <Route index element={<SearchPage />} />
                        <Route path="subscription" element={<SubscriptionPage />} />
                        <Route path="listenlater/:teleUserId" element={<ListenLaterPage />} />
                        <Route path="" element={<SearchPage />} />
                        <Route path="playlist" element={<PlayListIndexPage />} />
                        <Route path="playlist/:teleUserId" element={<PlayListPage />} />
                        <Route path="playlist/:teleUserId/:playlistId" element={<PlayListDetailPage />} />
                        <Route path="account" element={<AccountPage />} />
                        <Route path="*" element={<div>Not Found</div>} />
                    </Route>
                    <Route path="search" element={<SearchResultPage />} />
                    <Route path="/subscription/:teleUserId/:keyword" element={<SubscriptionKeywordListPage />} />
                    <Route path="/podcast/:channelId" element={<PodcastChannelPage />} />
                    <Route path="/podcast/:channelId/episode/:itemId" element={<PodcastEpisodePage />} />
                </Routes>
            </BrowserRouter>
        </AppProvider>
    )
}

export default App
