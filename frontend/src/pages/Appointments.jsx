import { useEffect, useState } from 'react';

import api from '../services/api';

function Appointments() {

    const [appointments, setAppointments] =
        useState([]);

    const [form, setForm] = useState({

        patientId: '',
        doctor: '',
        date: ''

    });

    useEffect(() => {

        fetchAppointments();

    }, []);

    async function fetchAppointments() {

        const res =
            await api.get('/appointments');

        setAppointments(res.data.appointments);

    }

    async function addAppointment() {

        await api.post('/appointments', form);

        fetchAppointments();

    }

    return (

        <div className="card">

            <h2>Appointments</h2>

            <input
                placeholder="Patient ID"
                onChange={(e) =>
                    setForm({
                        ...form,
                        patientId:
                            parseInt(e.target.value)
                    })
                }
            />

            <br /><br />

            <input
                placeholder="Doctor"
                onChange={(e) =>
                    setForm({
                        ...form,
                        doctor: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                placeholder="Date"
                onChange={(e) =>
                    setForm({
                        ...form,
                        date: e.target.value
                    })
                }
            />

            <br /><br />

            <button onClick={addAppointment}>
                Add Appointment
            </button>

            <hr />

            <ul>

                {appointments.map((a) => (

                    <li
                     key={a.id}
                    className="list-item"
                    >
                        Patient #{a.patientId}
                        — {a.doctor}
                        — {a.date}

                    </li>

                ))}

            </ul>

        </div>

    );

}

export default Appointments;