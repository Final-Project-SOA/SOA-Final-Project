import { useEffect, useState } from 'react';
import api from '../services/api';

function Appointments() {
    const [appointments, setAppointments] = useState([]);

    const [form, setForm] = useState({
        patientId: '',
        doctor: '',
        date: ''
    });

    const [search, setSearch] = useState('');
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    function normalizeId(id) {
        if (id === null || id === undefined) {
            return '';
        }

        if (typeof id === 'object') {
            if (id.low !== undefined) {
                return String(id.low);
            }

            if (id.toString) {
                return id.toString();
            }

            return JSON.stringify(id);
        }

        return String(id);
    }

    function normalizeAppointment(appointment) {
        return {
            id: normalizeId(appointment.id),
            patientId: appointment.patientId || '',
            doctor: appointment.doctor || '',
            date: appointment.date || ''
        };
    }

    async function fetchAppointments() {
        try {
            setMessage('');

            const res = await api.get('/appointments');

            const data = res.data.appointments || [];

            setAppointments(
                data.map((appointment) =>
                    normalizeAppointment(appointment)
                )
            );

        } catch (error) {
            console.log(error);
            setMessage(
                'Cannot load appointments. Check API Gateway and Appointment Service.'
            );
        }
    }

    async function saveAppointment(e) {
        e.preventDefault();

        const payload = {
            patientId: Number(form.patientId),
            doctor: form.doctor,
            date: form.date
        };

        try {
            if (editId) {
                await api.put(`/appointments/${editId}`, payload);
                setMessage('Appointment updated successfully.');
            } else {
                await api.post('/appointments', payload);
                setMessage('Appointment created. MCP Email Agent triggered.');
            }

            setForm({
                patientId: '',
                doctor: '',
                date: ''
            });

            setEditId(null);

            fetchAppointments();

        } catch (error) {
            console.log(error);
            setMessage('Error while saving appointment.');
        }
    }

    async function deleteAppointment(id) {
        const ok = window.confirm('Delete this appointment?');

        if (!ok) {
            return;
        }

        try {
            await api.delete(`/appointments/${id}`);
            setMessage('Appointment deleted successfully.');
            fetchAppointments();
        } catch (error) {
            console.log(error);
            setMessage('Error while deleting appointment.');
        }
    }

    async function searchAppointments() {
        try {
            if (search.trim() === '') {
                fetchAppointments();
                return;
            }

            const res = await api.get(
                `/appointments/search?keyword=${encodeURIComponent(search)}`
            );

            const data = res.data.appointments || [];

            setAppointments(
                data.map((appointment) =>
                    normalizeAppointment(appointment)
                )
            );

        } catch (error) {
            console.log(error);
            setMessage('Error while searching appointments.');
        }
    }

    function startEdit(appointment) {
        setEditId(appointment.id);

        setForm({
            patientId: appointment.patientId,
            doctor: appointment.doctor,
            date: appointment.date
        });
    }

    function cancelEdit() {
        setEditId(null);

        setForm({
            patientId: '',
            doctor: '',
            date: ''
        });
    }

    return (
        <div className="page-card">

            <div className="page-header">
                <div>
                    <h2>Appointments Management</h2>
                    <p>Create, update, search and delete appointments.</p>
                </div>

                <span className="badge">
                    {appointments.length} appointments
                </span>
            </div>

            {message && (
                <div className="message-box">
                    {message}
                </div>
            )}

            <form className="form-grid" onSubmit={saveAppointment}>

                <input
                    type="number"
                    placeholder="Patient ID"
                    value={form.patientId}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            patientId: e.target.value
                        })
                    }
                    required
                />

                <input
                    type="text"
                    placeholder="Doctor"
                    value={form.doctor}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            doctor: e.target.value
                        })
                    }
                    required
                />

                <input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            date: e.target.value
                        })
                    }
                    required
                />

                <div className="form-actions">
                    <button type="submit">
                        {editId
                            ? 'Update Appointment'
                            : 'Add Appointment'}
                    </button>

                    {editId && (
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={cancelEdit}
                        >
                            Cancel
                        </button>
                    )}
                </div>

            </form>

            <div className="search-panel">

                <input
                    type="text"
                    placeholder="Search by doctor, date or patient ID"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <button
                    type="button"
                    onClick={searchAppointments}
                >
                    Search
                </button>

                <button
                    type="button"
                    className="btn-secondary"
                    onClick={fetchAppointments}
                >
                    Reset
                </button>

            </div>

            {appointments.length === 0 ? (
                <p className="empty-text">
                    No appointments found.
                </p>
            ) : (
                <div className="items-list">

                    {appointments.map((appointment) => (

                        <div
                            className="item-card"
                            key={appointment.id}
                        >

                            <div>
                                <h3>
                                    Appointment #{appointment.id}
                                </h3>

                                <p>
                                    <strong>Patient ID:</strong>{' '}
                                    {appointment.patientId}
                                </p>

                                <p>
                                    <strong>Doctor:</strong>{' '}
                                    {appointment.doctor}
                                </p>

                                <p>
                                    <strong>Date:</strong>{' '}
                                    {appointment.date}
                                </p>
                            </div>

                            <div className="item-actions">

                                <button
                                    type="button"
                                    onClick={() =>
                                        startEdit(appointment)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    className="btn-danger"
                                    onClick={() =>
                                        deleteAppointment(appointment.id)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default Appointments;