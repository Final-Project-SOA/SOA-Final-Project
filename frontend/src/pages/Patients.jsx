import { useEffect, useState } from 'react';

import api from '../services/api';

function Patients() {

    const [patients, setPatients] = useState([]);

    const [form, setForm] = useState({
        name: '',
        age: '',
        disease: ''
    });

    const [search, setSearch] = useState('');

    const [editId, setEditId] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, []);

    async function fetchPatients() {

        try {

            setLoading(true);

            const res = await api.get('/patients');

            setPatients(res.data.patients || []);

        } catch (error) {

            console.log(error);

            alert('Cannot load patients. Check API Gateway and Patient Service.');

        } finally {

            setLoading(false);

        }

    }

    async function savePatient(e) {

        e.preventDefault();

        try {

            const payload = {
                name: form.name,
                age: Number(form.age),
                disease: form.disease
            };

            if (editId) {

                await api.put(`/patients/${editId}`, payload);

                alert('Patient updated successfully');

            } else {

                await api.post('/patients', payload);

                alert('Patient added successfully');

            }

            setForm({
                name: '',
                age: '',
                disease: ''
            });

            setEditId(null);

            fetchPatients();

        } catch (error) {

            console.log(error);

            alert('Error while saving patient');

        }

    }

    async function deletePatient(id) {

        const ok = window.confirm(
            'Do you really want to delete this patient?'
        );

        if (!ok) {
            return;
        }

        try {

            await api.delete(`/patients/${id}`);

            alert('Patient deleted successfully');

            fetchPatients();

        } catch (error) {

            console.log(error);

            alert('Error while deleting patient');

        }

    }

    async function searchPatients() {

        try {

            if (search.trim() === '') {
                fetchPatients();
                return;
            }

            const res = await api.get(
                `/patients/search?keyword=${encodeURIComponent(search)}`
            );

            setPatients(res.data.patients || []);

        } catch (error) {

            console.log(error);

            alert('Error while searching patients');

        }

    }

    function startEdit(patient) {

        setEditId(patient.id);

        setForm({
            name: patient.name,
            age: patient.age,
            disease: patient.disease
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    }

    function cancelEdit() {

        setEditId(null);

        setForm({
            name: '',
            age: '',
            disease: ''
        });

    }

    return (
        <section className="page-card">

            <div className="page-header">
                <div>
                    <h2>Patients Management</h2>
                    <p>Create, update, search and delete patients.</p>
                </div>

                <span className="badge">
                    {patients.length} patients
                </span>
            </div>

            <form className="form-grid" onSubmit={savePatient}>

                <input
                    placeholder="Patient name"
                    value={form.name}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            name: e.target.value
                        })
                    }
                    required
                />

                <input
                    type="number"
                    placeholder="Age"
                    value={form.age}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            age: e.target.value
                        })
                    }
                    required
                />

                <input
                    placeholder="Disease"
                    value={form.disease}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            disease: e.target.value
                        })
                    }
                    required
                />

                <div className="form-actions">
                    <button type="submit">
                        {editId ? 'Update Patient' : 'Add Patient'}
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
                    placeholder="Search by name or disease"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button onClick={searchPatients}>
                    Search
                </button>

                <button
                    className="btn-secondary"
                    onClick={fetchPatients}
                >
                    Reset
                </button>
            </div>

            {loading ? (
                <p className="empty-text">Loading patients...</p>
            ) : patients.length === 0 ? (
                <p className="empty-text">No patients found.</p>
            ) : (
                <div className="items-list">

                    {patients.map((patient) => (

                        <div
                            key={patient.id}
                            className="item-card"
                        >

                            <div>
                                <h3>{patient.name}</h3>

                                <p>
                                    <strong>Age:</strong> {patient.age}
                                </p>

                                <p>
                                    <strong>Disease:</strong> {patient.disease}
                                </p>
                            </div>

                            <div className="item-actions">
                                <button
                                    onClick={() => startEdit(patient)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn-danger"
                                    onClick={() =>
                                        deletePatient(patient.id)
                                    }
                                >
                                    Delete
                                </button>
                            </div>

                        </div>

                    ))}

                </div>
            )}

        </section>
    );

}

export default Patients;