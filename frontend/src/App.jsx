import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Navigate
} from 'react-router-dom';

import Patients from './pages/Patients';
import Appointments from './pages/Appointments';

function App() {
    return (
        <BrowserRouter>
            <div className="app-shell">

                <header className="topbar">
                    <div>
                        <h1>Smart Clinic SOA</h1>
                        <p>Microservices healthcare management system</p>
                    </div>

                    <nav>
                        <Link to="/patients">Patients</Link>
                        <Link to="/appointments">Appointments</Link>
                    </nav>
                </header>

                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/patients" replace />}
                    />

                    <Route
                        path="/patients"
                        element={<Patients />}
                    />

                    <Route
                        path="/appointments"
                        element={<Appointments />}
                    />
                </Routes>

            </div>
        </BrowserRouter>
    );
}

export default App;