const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const publishAppointment =
    require('../kafka/eventBus');

const PROTO_PATH =
    path.join(__dirname, '../../../proto/appointment.proto');

const packageDefinition =
    protoLoader.loadSync(PROTO_PATH);

const appointmentProto =
    grpc.loadPackageDefinition(packageDefinition).appointment;

const appointments = [];

function GetAppointments(call, callback) {

    callback(null, {
        appointments
    });

}

async function CreateAppointment(call, callback) {

    try {

        const appointment = {

            id: Date.now(),

            patientId: call.request.patientId,

            doctor: call.request.doctor,

            date: call.request.date
        };

        appointments.push(appointment);

        await publishAppointment(appointment);

        console.log('Appointment Kafka event published');

        callback(null, {

            id: appointment.id,

            patientId: appointment.patientId,

            doctor: appointment.doctor,

            date: appointment.date
        });

    } catch (error) {

        console.error(error);

        callback(error);
    }
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

            console.log(
                'Appointment gRPC running on 50052'
            );

            server.start();
        }
    );
}

main();