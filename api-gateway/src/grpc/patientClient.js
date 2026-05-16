const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../../../proto/patient.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);

const patientProto = grpc.loadPackageDefinition(packageDefinition).patient;

const client = new patientProto.PatientService(
    'localhost:50051',
    grpc.credentials.createInsecure()
);

module.exports = client;