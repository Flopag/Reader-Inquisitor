import Login from '@components/login.js';

export function App() {
    return  <>
                <Login child={<h1>Hello world! (ho, this is an update, V2)</h1>} />
            </>;
}