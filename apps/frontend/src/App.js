import Login from '@components/login.js';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Profile_page from '@pages/profile';
import Book_page from '@pages/book';
import Calendar from '@widgets/calendar';

export function App() {
    return  <>
                <BrowserRouter>
                    <Login child={
                        <div>
                            <nav>
                                <Link to="/">Home</Link> |{" "}
                                <Link to="/book">Book</Link> |{" "}
                                <Link to="/profile">Profile</Link>
                            </nav>
                            <Routes>
                                <Route path="/" element={<Calendar />} />
                                <Route path="/profile" element={<Profile_page />} />
                                <Route path="/book" element={<Book_page />} />
                            </Routes>
                        </div>
                    } />
                </BrowserRouter>
            </>;
}