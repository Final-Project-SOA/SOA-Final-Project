const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../../../proto/patient.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);

const patientProto = grpc.loadPackageDefinition(packageDefinition).patient;

const patients = [
    { id: 1, name: 'Fatma' },
    { id: 2, name: 'Eya' }
];

function GetPatients(call, callback) {
    callback(null, { patients });
}

function main() {
    const server = new grpc.Server();

    server.addService(patientProto.PatientService.service, {
        GetPatients
    });

    server.bindAsync(
        '0.0.0.0:50051',
        grpc.ServerCredentials.createInsecure(),
        () => {
            console.log('Patient gRPC Service running on port 50051');
            server.start();
        }
    );
}

main();