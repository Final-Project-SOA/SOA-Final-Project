const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const sendAppointmentEmail =
    require('../../../medical-service/src/email/sendEmail');

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

        console.log('Appointment created:', appointment);

        try {

            await publishAppointment(appointment);

            console.log('Appointment Kafka event published');

        } catch (kafkaError) {

            console.log('Kafka publish error:');
            console.log(kafkaError.message);

        }

        try {

            await sendAppointmentEmail(appointment);

            console.log('MCP Email AI Agent triggered');

        } catch (emailError) {

            console.log('MCP Email AI Agent error:');
            console.log(emailError.message);

        }

        callback(null, {

            id: appointment.id,

            patientId: appointment.patientId,

            doctor: appointment.doctor,

            date: appointment.date

        });

    } catch (error) {

        console.log('CreateAppointment error:');
        console.log(error.message);

        callback({
            code: grpc.status.INTERNAL,
            message: error.message
        });

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

        (error, port) => {

            if (error) {

                console.log('gRPC server error:');
                console.log(error.message);
                return;

            }

            console.log(
                `Appointment gRPC running on ${port}`
            );

            server.start();

        }

    );

}

main();