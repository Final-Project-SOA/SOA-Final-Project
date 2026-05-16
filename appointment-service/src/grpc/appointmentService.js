const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const db = require('../db/database');

const PROTO_PATH = path.join(__dirname, '../../../proto/appointment.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const appointmentProto = grpc.loadPackageDefinition(packageDefinition).appointment;

function GetAppointments(call, callback) {
    db.all('SELECT * FROM appointments', [], (err, rows) => {
        if (err) {
            return callback(err);
        }

        callback(null, { appointments: rows });
    });
}

function CreateAppointment(call, callback) {
    const { patientId, doctor, date } = call.request;

    db.run(
        'INSERT INTO appointments(patientId, doctor, date) VALUES (?, ?, ?)',
        [patientId, doctor, date],
        function (err) {
            if (err) {
                return callback(err);
            }

            callback(null, {
                id: this.lastID,
                patientId,
                doctor,
                date
            });
        }
    );
}

function main() {
    const server = new grpc.Server();

    server.addService(
        appointmentProto.AppointmentService.service,
        {
            GetAppointments,
            CreateAppointment
        }
    );

    server.bindAsync(
        '0.0.0.0:50052',
        grpc.ServerCredentials.createInsecure(),
        () => {
            console.log('Appointment gRPC running on 50052');
            server.start();
        }
    );
}

main();