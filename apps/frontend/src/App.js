import Login from '@components/login.js';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Profile_page from '@pages/profile';

export function App() {
    return  <>
                <BrowserRouter>
                    <Login child={
                        <div>
                            <nav>
                                <Link to="/">Home</Link> |{" "}
                                <Link to="/profile">Profile</Link>
                            </nav>
                            <Routes>
                                <Route path="/" element={<h1>Welcome to reader inquisitor</h1>} />
                                <Route path="/profile" element={<Profile_page />} />
                            </Routes>
                        </div>
                    } />
                </BrowserRouter>
            </>;
}