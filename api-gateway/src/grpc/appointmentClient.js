const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH =
    path.join(__dirname, '../../../proto/appointment.proto');

const packageDefinition =
    protoLoader.loadSync(PROTO_PATH);

const appointmentProto =
    grpc.loadPackageDefinition(packageDefinition).appointment;

const client =
    new appointmentProto.AppointmentService(
        'localhost:50052',
        grpc.credentials.createInsecure()
    );

module.exports = client;