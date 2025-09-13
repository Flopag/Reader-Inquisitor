import Login from '@components/login.js';
import Profile_page from '@pages/profile'

export function App() {
    return  <>
                <Login child={<Profile_page />} />
            </>;
}