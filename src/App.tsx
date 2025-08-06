import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SearchPage from './pages/SearchPage'
import AppDockNavigation from './component/AppDockNavigation'
import ListenLaterPage from './pages/ListenLaterPage'
import PlayListPage from './pages/PlayListPage'
import AccountPage from './pages/AccountPage'
import SubscriptionPage from './pages/SubscriptionPage'

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AppDockNavigation />}>
                    <Route index element={<SearchPage />} />
                    <Route path="subscription" element={<SubscriptionPage />} />
                    <Route path="listenlater" element={<ListenLaterPage />} />
                    <Route path="search" element={<SearchPage />} />
                    <Route path="playlist" element={<PlayListPage />} />
                    <Route path="account" element={<AccountPage />} />
                    {/* Add a catch-all route if needed */}
                    <Route path="*" element={<div>Not Found</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
