const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../../../proto/patient.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const patientProto = grpc.loadPackageDefinition(packageDefinition).patient;

const dbPath = path.join(__dirname, '../../patient.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            disease TEXT NOT NULL
        )
    `);
});

function GetPatients(call, callback) {
    db.all('SELECT * FROM patients', [], (error, rows) => {
        if (error) {
            return callback(error);
        }

        callback(null, {
            patients: rows
        });
    });
}

function AddPatient(call, callback) {
    const { name, age, disease } = call.request;

    db.run(
        'INSERT INTO patients (name, age, disease) VALUES (?, ?, ?)',
        [name, age, disease],
        function (error) {
            if (error) {
                return callback(error);
            }

            callback(null, {
                id: this.lastID,
                name,
                age,
                disease
            });
        }
    );
}

function UpdatePatient(call, callback) {
    const { id, name, age, disease } = call.request;

    db.run(
        'UPDATE patients SET name = ?, age = ?, disease = ? WHERE id = ?',
        [name, age, disease, id],
        function (error) {
            if (error) {
                return callback(error);
            }

            if (this.changes === 0) {
                return callback({
                    code: grpc.status.NOT_FOUND,
                    message: 'Patient not found'
                });
            }

            callback(null, {
                id,
                name,
                age,
                disease
            });
        }
    );
}

function DeletePatient(call, callback) {
    const { id } = call.request;

    db.run(
        'DELETE FROM patients WHERE id = ?',
        [id],
        function (error) {
            if (error) {
                return callback(error);
            }

            if (this.changes === 0) {
                return callback(null, {
                    success: false,
                    message: 'Patient not found'
                });
            }

            callback(null, {
                success: true,
                message: 'Patient deleted successfully'
            });
        }
    );
}

function SearchPatients(call, callback) {
    const keyword = `%${call.request.keyword}%`;

    db.all(
        `
        SELECT * FROM patients
        WHERE name LIKE ?
        OR disease LIKE ?
        `,
        [keyword, keyword],
        (error, rows) => {
            if (error) {
                return callback(error);
            }

            callback(null, {
                patients: rows
            });
        }
    );
}

function main() {
    const server = new grpc.Server();

    server.addService(
        patientProto.PatientService.service,
        {
            GetPatients,
            AddPatient,
            UpdatePatient,
            DeletePatient,
            SearchPatients
        }
    );

    server.bindAsync(
        '0.0.0.0:50051',
        grpc.ServerCredentials.createInsecure(),
        (error, port) => {
            if (error) {
                console.log('Patient gRPC error:', error.message);
                return;
            }

            console.log(`Patient gRPC Service running on ${port}`);
            server.start();
        }
    );
}

main();