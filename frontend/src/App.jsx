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

            <div className="container">

                <div className="navbar">

                    <h2>Smart Clinic SOA</h2>

                    <div className="nav-links">

                        <Link to="/patients">
                            Patients
                        </Link>

                        <Link to="/appointments">
                            Appointments
                        </Link>

                    </div>

                </div>

                <Routes>

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/patients"
                                replace
                            />
                        }
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