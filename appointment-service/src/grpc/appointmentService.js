const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../../../proto/appointment.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);

const appointmentProto = grpc.loadPackageDefinition(packageDefinition).appointment;

const appointments = [
    { id: 1, doctor: 'Dr Ahmed' },
    { id: 2, doctor: 'Dr Sami' }
];

function GetAppointments(call, callback) {
    callback(null, { appointments });
}

function main() {

    const server = new grpc.Server();

    server.addService(
        appointmentProto.AppointmentService.service,
        {
            GetAppointments
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