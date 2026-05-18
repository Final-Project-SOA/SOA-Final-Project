import {

  BrowserRouter,
  Routes,
  Route,
  Link

} from 'react-router-dom';

import Dashboard from './pages/Dashboard';

import Patients from './pages/Patients';

import Appointments from './pages/Appointments';

function App() {

  return (

    <BrowserRouter>

      <div className="container">

        <div className="navbar">

          <h2>🏥 Smart Clinic SOA</h2>

          <div className="nav-links">

            <Link to="/">Dashboard</Link>

            <Link to="/patients">Patients</Link>

            <Link to="/appointments">
              Appointments
            </Link>

          </div>

        </div>

        <Routes>

          <Route
            path="/"
            element={<Dashboard />}
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