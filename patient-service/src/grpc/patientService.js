const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const db = require('../db/database');

const PROTO_PATH = path.join(__dirname, '../../../proto/patient.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);

const patientProto = grpc.loadPackageDefinition(packageDefinition).patient;

function GetPatients(call, callback) {

    db.all('SELECT * FROM patients', [], (err, rows) => {

        if (err) {
            return callback(err);
        }

        callback(null, { patients: rows });

    });

}

function AddPatient(call, callback) {

    const { name, age, disease } = call.request;

    db.run(
        'INSERT INTO patients(name, age, disease) VALUES (?, ?, ?)',
        [name, age, disease],
        function(err) {

            if (err) {
                return callback(err);
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

function main() {

    const server = new grpc.Server();

    server.addService(
        patientProto.PatientService.service,
        {
            GetPatients,
            AddPatient
        }
    );

    server.bindAsync(
        '0.0.0.0:50051',
        grpc.ServerCredentials.createInsecure(),
        () => {

            console.log('Patient gRPC Service running on 50051');

          
        }
    );

}

main();