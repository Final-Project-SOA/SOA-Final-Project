import { useEffect, useState } from 'react';

import api from '../services/api';
import { initDB, db } from '../database';
function Patients() {

    const [patients, setPatients] = useState([]);

    const [form, setForm] = useState({

        name: '',
        age: '',
        disease: ''

    });

   useEffect(() => {

    async function load() {

        await initDB();

        fetchPatients();

    }

    load();

}, []);

    async function fetchPatients() {

        const res = await api.get('/patients');

        setPatients(res.data.patients);
        await db.patients.bulkInsert(

    res.data.patients.map((p) => ({

        id: String(p.id),
        name: p.name,
        disease: p.disease

    }))

);

    }

    async function addPatient() {

        await api.post('/patients', form);

        fetchPatients();

    }

    return (

       <div className="card">

            <h2>Patients</h2>

            <input
                placeholder="Name"
                onChange={(e) =>
                    setForm({
                        ...form,
                        name: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                placeholder="Age"
                onChange={(e) =>
                    setForm({
                        ...form,
                        age: parseInt(e.target.value)
                    })
                }
            />

            <br /><br />

            <input
                placeholder="Disease"
                onChange={(e) =>
                    setForm({
                        ...form,
                        disease: e.target.value
                    })
                }
            />

            <br /><br />

            <button onClick={addPatient}>
                Add Patient
            </button>

            <hr />

            <ul>

                {patients.map((p) => (

                    <li
                    key={p.id}
                    className="list-item"
                     >

                        {p.name} - {p.age} years - {p.disease}

                    </li>

                ))}

            </ul>

        </div>

    );

}

export default Patients;