import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SearchPage from './pages/SearchPage'
import AppDockNavigation from './component/AppDockNavigation'
import ListenLaterPage from './pages/ListenLaterPage'
import PlayListPage from './pages/PlayListPage'
import AccountPage from './pages/AccountPage'
import SubscriptionPage from './pages/subscription/SubscriptionPage'
import SearchResultPage from './pages/SearchResultPage'
import { AppProvider } from './component/AppContext'
import SubscriptionKeywordListPage from './pages/subscription/SubscriptionKeywordListPage'

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
                        <Route path="playlist" element={<PlayListPage />} />
                        <Route path="account" element={<AccountPage />} />
                        <Route path="*" element={<div>Not Found</div>} />
                    </Route>
                    <Route path="search" element={<SearchResultPage />} />
                    <Route path="/subscription/:userId/:keyword" element={<SubscriptionKeywordListPage />} />
                </Routes>
            </BrowserRouter>
        </AppProvider>
    )
}

export default App
